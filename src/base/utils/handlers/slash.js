import { Handler } from "../../structures/export.js";

import { PermissionsBitField } from "discord.js";

export default class extends Handler {
  constructor() {
    super({ enabled: true, type: "ChatCommand" });

    this.setName(this.Events.Discord.InteractionCreate);
  };

  async execute(interaction) {
    if (!this.loader.commands.slash.has(interaction.commandName)) return;

    const client = interaction.client;
    const member = interaction.member;
    const channel = interaction.channel;
    const guild = interaction.guild;
    const options = interaction.options;
    const commandName = String(options.getSubcommand(false)).toLowerCase();

    const command = this.loader.commands.slash.get(interaction.commandName);

    if (command.permissions.length > 0) {
      const requiredPermissions = [];

      for (let index = 0; index < command.permissions.length; index++) {
        const permission = command.permissions[ index ];
        const resolvePermission = PermissionsBitField.resolve(permission);

        if (!(member.permissions.has(resolvePermission))) requiredPermissions.push(permission);
      };

      if (requiredPermissions.length > 0) {
        const embed = new this.Embed({
          title: this.translate("data:events.handlers.interaction.permission.title", { variables: [ { name: "permissionEmote", value: this.config.Emoji.Other.PERMISSION } ] }),
          description: this.translate("data:events.handlers.interaction.permission.description", { variables: [ { name: "errorEmote", value: this.config.Emoji.State.ERROR } ] }),
          fields: [
            {
              name: this.translate("data:events.handlers.interaction.permission.fields.required", { variables: [ { name: "editorEmote", value: this.config.Emoji.Other.EDITOR } ] }),
              value: `\`${requiredPermissions.map((permission) => this.translate("data:permissions.body", { variables: [ { name: "t", value: this.translate(`data:permissions.${permission}`) } ] })).join(", ")}\``
            }
          ],
          thumbnail: { url: member.displayAvatarURL() }
        })
          .setColor("Random")
          .setTimestamp();

        return interaction.reply({ embeds: [ embed ] });
      };

      if (requiredPermissions.length > 0) return;
    };

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

    command.execute({ interaction: interaction, options: options, member: member, channel: channel, guild: guild, command: commandName })
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