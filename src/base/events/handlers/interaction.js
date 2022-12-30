import { Handler } from "../../structures/export.js";

export default class extends Handler {
  constructor() {
    super({ enabled: true, type: "ChatCommand" });

    this.setProperty([{ key: "Name", value: this.Events.Discord.InteractionCreate }]);
  };

  async execute(interaction) {
    if (!this.loader.commands.has(interaction.commandName)) return;

    const client = interaction.client;
    const member = interaction.member;
    const channel = interaction.channel;
    const guild = interaction.guild;

    const command = this.loader.commands.get(interaction.commandName);

    if (command.developer && !this.checker.isOwner(member.id)) return interaction.reply({ content: `${this.config.Emoji.State.ERROR} ${member}, Are you \`${client.user.tag}\` developer?`, ephemeral: true });

    const options = interaction.options;
    const commandName = String(options.getSubcommand(false)).toLowerCase();

    await command.execute({
      interaction: interaction,
      options: options,
      member: member,
      channel: channel,
      guild: guild,
      command: commandName
    }).catch(async (err) => {
      const errorEmbed = new this.Embed({
        title: `${this.config.Emoji.State.ERROR} An error ocurred.`,
        description: `${this.config.Emoji.Other.NOTEPAD} I'm reported this error to my Developers.`,
        footer: {
          text: `> Please check again later...`
        },
        thumbnail: {
          url: interaction.user?.avatarURL()
        }
      });

      const guild = this.emojis.cache.get("1035523616726593547");
      const invites = this.invites.map("1035197544495599616").storage;
      const row = new this.Row({
        components: [
          new this.Button({
            style: this.ButtonStyle.Link,
            label: "Support Server",
            emoji: { id: guild.id, name: guild.name, animated: guild.animated },
            url: invites.length > 0 ? `https://discord.gg/${invites[0]}` : "https://discord.com",
            disabled: invites.length > 0 ? false : true
          })
        ]
      });

      const reportEmbed = new this.Embed({
        title: `${this.config.Emoji.State.ERROR} An error ocurred when executing command.`,
        description: `\`\`\`js\n${err}\`\`\``,
        fields: [
          {
            name: `${this.config.Emoji.Other.USER} Author`,
            value: `- ${member} (${member.id})`,
            inline: true
          },
          {
            name: `${this.config.Emoji.Other.CALENDAR} Time`,
            value: `- <t:${Math.floor(interaction.createdTimestamp / 1000)}:R>`,
            inline: true
          },
          {
            name: `${this.config.Emoji.Other.PROTOTIP} Command`,
            value: `- ${command.data.name}`,
            inline: true
          }
        ]
      });


      console.log(err);

      if (interaction.replied) return await interaction.followUp({ embeds: [errorEmbed], ephemeral: true, fetchReply: true }).then(async () => {
        return client.channels.resolve((await this.channels.get("1033367989183074374")).id).send({ content: `<@&${(await this.roles.get("1031149192862777415", "1031151171202732032")).id}>`, embeds: [reportEmbed], components: [row] }).then(async (msg) => {
          await this.messages.pin(msg);
        });
      });
      else return interaction.reply({ embeds: [errorEmbed], ephemeral: true, fetchReply: true }).then(async () => {
        return client.channels.resolve((await this.channels.get("1033367989183074374")).id).send({ content: `<@&${(await this.roles.get("1031149192862777415", "1031151171202732032")).id}>`, embeds: [reportEmbed], components: [row] }).then(async (msg) => {
          await this.messages.pin(msg);
        });
      });
    });
  };
};