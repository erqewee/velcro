import { Event } from "../../structures/export.js";

export default class extends Event {
  constructor() {
    super({
      enabled: true,
      process: false,
      type: "Modal"
    });

    this.setName(this.Events.Discord.InteractionCreate);

    this.execute = async function (interaction) {
      const client = interaction.client;
      const db = this.databases.general;

      const guild = client.guilds.resolve("942839259876958268");
      if (interaction.customId === "register") {
        const unregisteredRole = guild.roles.resolve(db.fetch(`Guild_${guild.id}.Settings.Register.Unregistered`));
        const memberRole = guild.roles.resolve(db.fetch(`Guild_${guild.id}.Settings.Register.Member`));
        const channel = guild.channels.resolve(db.fetch(`Guild_${guild.id}.Settings.Register.Channel`));

        const member = guild.members.cache.get(interaction.fields.getTextInputValue("memberID"));
        const name = interaction.fields.getTextInputValue("memberName");

        const message = interaction.fields.getTextInputValue("messageID") ? await channel.messages.fetch(interaction.fields.getTextInputValue("messageID")) : null;

        member.setNickname(`» ${name}`);

        member.roles.add(memberRole.id);
        member.roles.remove(unregisteredRole.id);

        db.add(`Guild_${guild.id}.Register.Employee_${interaction.user.id}.Number`, 1);

        const fetchRegCount = db.fetch(`Guild_${guild.id}.Register.Employee_${interaction.user.id}.Number`);

        const embed = new this.Embed({
          title: `${client.user.username} - Kayıt Sistemi`,
          fields: [
            {
              name: `${this.config.Emoji.Other.USER} Kullanıcı`,
              value: `- ${member}`,
              inline: true
            },
            {
              name: `${this.config.Emoji.Other.NOTEPAD} Adı`,
              value: `- ${name}`,
              inline: true
            },
            {
              name: `${this.config.Emoji.Other.USER} Yetkili`,
              value: `- ${interaction.user}`,
              inline: true
            },
          ],
          thumbnail: {
            url: interaction.user?.avatarURL()
          },
          footer: {
            text: `${interaction.user.tag}, toplam kayıt sayın ${fetchRegCount}`
          }
        });

        const components = [
          new this.Row({
            components: [
              new this.Button({
                style: this.ButtonStyle.Success,
                label: "Kullanıcı Adını Düzenle",
                customId: "registerBtn-editMemberName",
                disabled: true
              })
            ]
          })
        ];

        message ? message.edit({ components: [] }) : null;
        return interaction.reply({ embeds: [embed], components });
      };
    };
  };
}; 