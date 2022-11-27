import { Event } from "../../structures/export.js";

export default class extends Event {
  constructor() {
    super({
      enabled: true,
      process: false
    });

    this.setName(this.Events.Discord.GuildMemberRemove);

    this.execute = async function (m) {
      const client = this.client;
      const user = await client.users.resolve(m.id);

      const db = this.databases.subscribe;

      const guild = await client.guilds.resolve("942839259876958268");

      if (db.fetch(`Subscribe.Member_${user.id}`)) {
        const date = Math.floor(Date.now() / 1000);

        db.del(`Subscribe.Member_${user.id}`);
        db.pull("Subscribe.Members", (data) => data === user.id);

        db.set(`BlackList.Member_${user.id}`, { State: true, Reason: "Automatic Process", Employee: client.user.id, Date: date });
        db.push("BlackList.Members", user.id);

        const embed = new this.Embed({
          title: `${client.user.username} - Kara Liste | Eklendi`,
          description: `${this.config.Emoji.State.SUCCESS} Bir kullanıcı karalisteye eklendi.`,
          fields: [
            {
              name: `${this.config.Emoji.Other.ADMIN} Yetkili`,
              value: `- ${client.user}`,
              inline: true
            },
            {
              name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
              value: `- <t:${date}:R>`,
              inline: true
            }
          ],
          author: {
            name: `${user.tag} | ${user.id}`,
            iconURL: guild?.iconURL()
          },
          thumbnail: {
            url: user?.avatarURL()
          }
        });

        return (await client.channels.resolve((await guild.channels.resolve(db.fetch(`Subscribe.Settings.LogChannel`))).id)).send({ embeds: [embed] });
      }
    };
  };
};