import { Handler } from "../../structures/export.js";

export default class extends Handler {
  constructor() {
    super({ enabled: true, type: "ContextCommand" });

    this.setName(this.Events.Discord.InteractionCreate);
  };

  async execute(interaction) {
    if (!this.loader.commands.context.has(interaction.commandName)) return;

    const client = interaction.client;
    const guild = interaction.guild;

    const member = interaction.member;
    const target = guild.members.resolve(interaction.targetId);

    const command = this.loader.commands.context.get(interaction.commandName);

    if (command.developer && !this.checker.isOwner(member.id)) return interaction.reply({
      content: this.translate("data:events.handlers.interaction.developerMessage", {
        variables: [
          {
            name: "errorEmote",
            value: this.config.Emoji.State.ERROR
          },
          {
            name: "member",
            value: member
          },
          {
            name: "client.user",
            value: client.user
          }
        ]
      }), ephemeral: true
    });

    if (this.loader.cooldowns.has(`${member.id}_${command.data.name}`)) {
      const cooldown = this.loader.cooldowns.fetch(`${member.id}_${command.data.name}`);
      const date = new Date();

      const remaining = (new Date(cooldown - date).getTime() / 1000).toFixed();

      return interaction.reply({ content: `${this.config.Emoji.State.WARNING} Wait '${remaining} Seconds' to use this command again.` });
    };
    
    command.execute({ interaction: interaction, member: member, target: target, guild: guild })
      .then(() => {
        if (this.checker.isOwner(member.id)) return;

        const date = new Date();
        date.setSeconds(date.getSeconds() + command.cooldown);

        this.loader.cooldowns.set(`${member.id}_${command.data.name}`, date);

        setTimeout(() => this.loader.cooldowns.delete(`${member.id}_${command.data.name}`), (command.cooldown * 1000));
      }).catch((err) => command.error({ interaction: interaction, error: err, command: command }).catch((err) => this.error({ error: err })))

    return void 0;
  };
};