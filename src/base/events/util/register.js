import { Event } from "../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: true, type: "Modal" });

    this.setName(this.Events.Discord.InteractionCreate);
  };

  async execute(interaction) {
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
        title: `${client.user.username} - ${this.translate("data:events.util.register.title")}`,
        fields: [
          {
            name: `${this.config.Emoji.Other.USER} ${this.translate("data:events.util.register.user")}`,
            value: `- ${member}`,
            inline: true
          },
          {
            name: `${this.config.Emoji.Other.NOTEPAD} ${this.translate("data:events.util.register.name")}`,
            value: `- ${name}`,
            inline: true
          },
          {
            name: `${this.config.Emoji.Other.USER} ${this.translate("data:events.util.register.employee")}`,
            value: `- ${interaction.user}`,
            inline: true
          },
        ],
        thumbnail: {
          url: interaction.user?.avatarURL()
        },
        footer: {
          text: this.translate("data:events.util.register.totalRegisterCount", { variables: [{ name: "count", value: fetchRegCount }, { name: "user.tag", value: interaction.user.tag }] })
        }
      });

      const components = [
        new this.Row({
          components: [
            new this.Button({
              style: this.ButtonStyle.Success,
              label: this.translate("data:events.util.register.editMemberName"),
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