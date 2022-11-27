import { Event } from "../../structures/export.js";

import ms from "ms";

export default class extends Event {
  constructor() {
    super({
      enabled: true,
      process: false
    });

    this.setName(this.Events.Discord.GuildMemberAdd);

    this.execute = async function (m) {
      const client = this.client;
      const db = this.databases.general;

      const guild = client.guilds.resolve("942839259876958268");

      const user = client.users.resolve(m.id);
      const member = guild.members.resolve(user.id);
      member.setNickname(db.fetch(`Guild_${guild.id}.Settings.Register.UnregisteredName`));

      const accountDate = Math.floor((user?.createdAt ? user.createdAt : Date.now()) / 1000);
      const check = user.createdAt < ms("30d");

      const channel = client.channels.resolve(db.fetch(`Guild_${guild.id}.Settings.Register.Channel`));

      const emote = guild.emojis.resolve("955028721230839878");
      const emoteYes = guild.emojis.resolve("943869900877877289");
      const emoteNo = guild.emojis.resolve("943869900668174366");

      const embed = new this.Embed({
        title: `${client.user.username} - Kayıt Sistemi`,
        description: `
        ${this.config.Emoji.Other.USER} Sunucumuza hoş geldin ${user}!
        ${this.config.Emoji.Other.CRYSTAL} Seninle beraber toplam **${m.guild.memberCount}** kişi olduk.
        ${this.config.Emoji.State.LOADING} Kayıt olmak için yetkilileri beklemen yeterlidir.

        ${this.config.Emoji.Other.CALENDAR} <t:${accountDate}:F> (<t:${accountDate}:R>) [${check ? emoteYes : emoteNo}]
        `,
        author: {
          name: `${user.tag} | ${user.id}`,
          iconURL: guild?.iconURL()
        },
        thumbnail: {
          url: member?.displayAvatarURL()
        }
      });

      const regButton = new this.Row({
        components: [
          new this.Button({
            customId: "registerBtn",
            label: "Hızlı Kayıt",
            style: this.ButtonStyle.Primary,
            emoji: { name: emote.name, id: emote.id, animated: emote.animated }
          })
        ]
      });

      const msg = await channel.send({ embeds: [embed], components: [regButton] });

      const modal = new this.Modal({
        customId: "register",
        title: `${client.user.username} - Kayıt Sistemi`,
        components: [
          new this.Row({
            components: [
              new this.TextInput({
                customId: "messageID",
                label: "Message ID",
                style: this.TextInputStyle.Paragraph,
                maxLength: Number(String(msg.id).length),
                minLength: Number(String(msg.id).length),
                value: msg.id
              })
            ]
          }),

          new this.Row({
            components: [
              new this.TextInput({
                customId: "memberID",
                label: "Kullanıcı ID",
                style: this.TextInputStyle.Paragraph,
                maxLength: Number(String(member.id).length),
                minLength: Number(String(member.id).length),
                value: member.id,
                required: true,
              }),
            ]
          }),

          new this.Row({
            components: [
              new this.TextInput({
                customId: "memberName",
                label: "Kullanıcı Adı",
                style: this.TextInputStyle.Paragraph,
                maxLength: Number(String(user.username).length * 2),
                minLength: 2,
                value: user.username,
                required: true
              })
            ]
          })
        ]
      });

      const collector = await msg.channel.createMessageComponentCollector();
      collector.on("collect", async (i) => {
        if (!i.isButton()) return;

        if (i.customId === "registerBtn") {
          if (!i.member.roles.cache.has(db.fetch(`Guild_${guild.id}.Settings.Register.Employee`))) return await i.followUp({ content: `${i.member}, Bu işlevi kullanmak için yetkiniz yok.`, ephemeral: true });

          await i.showModal(modal);
        };
      });
    };
  };
};