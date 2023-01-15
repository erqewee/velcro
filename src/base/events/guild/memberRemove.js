import { Event } from "../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: true });

    this.setName(this.Events.Discord.GuildMemberRemove);
  };

  async execute(m) {
    const client = this.client;
    const user = client.users.resolve(m.id);

    const db = this.databases.subscribe;

    const guild = client.guilds.resolve("942839259876958268");

    const fetchSubscribeData = db.fetch("Subscribe.Members")?.filter((value) => value.id === user.id)[0];

    if (fetchSubscribeData?.employee) {
      const date = this.time(Date.now(), null, { onlyNumberOutput: true });

      db.pull("Subscribe.Members", (data) => data.id === user.id);

      db.push("Subscribe.BlackList", {
        id: user.id,
        reason: "Automatic Process",
        employee: client.user.id,
        date: date
      });

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

      return client.channels.resolve(db.fetch(`Subscribe.Settings.LogChannel`)).send({ embeds: [embed] });
    };
  };
};