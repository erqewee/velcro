import { Command, Handler } from "../../structures/export.js";

export default class extends Handler {
  constructor() {
    super({ enabled: true, type: "ChatCommand" });

    this.setName(this.Events.Discord.InteractionCreate);
  };

  async execute(interaction) {
    if (!this.loader.commands.has(interaction.commandName)) return;

    const client = interaction.client;
    const member = interaction.member;
    const channel = interaction.channel;
    const guild = interaction.guild;
    const options = interaction.options;
    const commandName = String(options.getSubcommand(false)).toLowerCase();

    const command = this.loader.commands.get(interaction.commandName);

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

    try {
      await command.execute({ interaction: interaction, options: options, member: member, channel: channel, guild: guild, command: commandName });
    } catch (err) {
      const errorEmbed = new this.Embed({
        title: this.translate("data:events.handlers.interaction.error.userData.title", { variables: [{ name: "errorEmote", value: this.config.Emoji.State.ERROR }] }),
        description: this.translate("data:events.handlers.interaction.error.userData.description", { variables: [{ name: "notepadEmote", value: this.config.Emoji.Other.NOTEPAD }] }),
        footer: {
          text: this.translate("data:events.handlers.interaction.error.userData.footer.text")
        },
        thumbnail: {
          url: interaction.user?.avatarURL()
        }
      });

      const guild = this.emojis.cache.get("1035523616726593547");
      const invites = await this.invites.map("1035197544495599616");

      const row = new this.Row({
        components: [
          new this.Button({
            style: this.ButtonStyle.Link,
            label: "Support Server",
            emoji: { id: guild.id, name: guild.name, animated: guild.animated },
            url: invites.length > 0 ? `https://discord.gg/${invites[0].code}` : "https://discord.com",
            disabled: invites.length > 0 ? false : true
          })
        ]
      });

      const reportEmbed = new this.Embed({
        title: this.translate("data:events.handlers.interaction.error.reportData.title", { variables: [{ name: "errorEmote", value: this.config.Emoji.State.ERROR }] }),
        description: this.translate("data:events.handlers.interaction.error.reportData.description", { variables: [{ name: "err", value: err }] }),
        fields: [
          {
            name: this.translate("data:events.handlers.interaction.error.reportData.fields.author", { variables: [{ name: "userEmote", value: this.config.Emoji.Other.USER }] }),
            value: `- ${member} (${member.id})`,
            inline: true
          },
          {
            name: this.translate("data:events.handlers.interaction.error.reportData.fields.time", { variables: [{ name: "calendarEmote", value: this.config.Emoji.Other.CALENDAR }] }),
            value: `- ${this.time(Date.now())}`,
            inline: true
          },
          {
            name: this.translate("data:events.handlers.interaction.error.reportData.fields.command", { variables: [{ name: "prototipEmote", value: this.config.Emoji.Other.PROTOTIP }] }),
            value: `- ${command.data.name}`,
            inline: true
          }
        ]
      });

      console.log(err);

      if (interaction.replied) return interaction.followUp({ embeds: [errorEmbed], ephemeral: true, fetchReply: true }).then(async () => {
        return client.channels.resolve("1033367989183074374").send({
          content: `<@&1031151171202732032>`, embeds: [reportEmbed], components: [row]
        }).then((msg) => this.messages.pin(msg));
      });
      else return interaction.reply({ embeds: [errorEmbed], ephemeral: true, fetchReply: true }).then(async () => {
        return client.channels.resolve("1033367989183074374").send({
          content: `<@&1031151171202732032>`, embeds: [reportEmbed], components: [row]
        }).then((msg) => this.messages.pin(msg));
      });
    };
  };
};