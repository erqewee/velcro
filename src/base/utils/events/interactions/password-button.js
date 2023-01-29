import { Event } from "../../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: true, type: "Button" });

    this.setName(this.Events.Discord.InteractionCreate);
  };

  async execute(interaction) {
    const db = this.databases.subscribe;

    if (interaction.customId == "password") {
      await interaction.deferUpdate().catch(async (err) => await interaction.followUp({ content: `${err}`, ephemeral: true }));

      const password = db.fetch("Subscribe.Settings.Password") ?? "Şifre Ayarlanmamış.";
      const log = this.client.channels.resolve(db.fetch("Subscribe.Settings.LogChannel"));

      const embed = new this.Embed({
        title: `${this.client.user.username} - Abone Sistemi | Şifre`,
        description: `\`\`\`txt\n${password}\`\`\``,
        fields: [
          {
            name: `${this.config.Emoji.Other.PIN} FAQ`,
            value: `<#1005542841331765378>`
          }
        ],
        thumbnail: { url: interaction.member?.displayAvatarURL() }
      }).setColor("Random").setTimestamp();

      const logEmbed = new this.Embed({
        title: `${this.client.user.username} - Abone Sistemi | Şifre Alındı`,
        description: `${this.config.Emoji.State.SUCCESS} Şifre istendi!`,
        fields: [
          {
            name: `${this.config.Emoji.Other.USER} Kullanıcı`,
            value: `- ${interaction.member}`,
            inline: true
          },
          {
            name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
            value: `- ${this.time(Date.now())}`,
            inline: true
          },
          {
            name: `${this.config.Emoji.Other.FIRE} Şifre`,
            value: `\`${password}\``
          }
        ],
        thumbnail: { url: interaction.member?.displayAvatarURL() }
      });

      await interaction.followUp({ embeds: [embed], ephemeral: true });
      return log.send({ embeds: [logEmbed] });
    };
  };
};