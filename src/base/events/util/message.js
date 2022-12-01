import { Event } from "../../structures/export.js";

export default class extends Event {
  constructor() {
    super({
      enabled: true,
      process: false
    });

    this.setName(this.Events.Discord.MessageCreate);

    this.execute = async function (message) {
      const client = message.client;

      if (message.author.bot) return;
      if (message.attachments.size < 1) return;

      const member = message.member;
      const user = await client.users.fetch(member.id);

      const db = this.databases.subscribe;
      const guild = client.guilds.resolve("942839259876958268");

      const config = {
        employee: db.fetch(`Subscribe.Settings.EmployeeRole`),
        log: db.fetch(`Subscribe.Settings.LogChannel`),
        password: db.fetch(`Subscribe.Settings.Password`),
        subscribe: db.fetch(`Subscribe.Settings.SubscribeRole`),
        subscribeChannel: db.fetch(`Subscribe.Settings.SubscribeChannel`),
        lastVideo: db.fetch("Subscribe.Settings.Videos.Last")
      };

      const availableChannels = [config.subscribeChannel, "982987883344429066"];
      const blacklist = db.fetch(`BlackList.Member_${member.id}`);

      let mention = "";
      const embeds = [];
      const components = [];

      if (!blacklist) components.push(new this.Row({
        components: [
          new this.Button({
            style: this.ButtonStyle.Link,
            label: "Son Video'ya Git",
            url: String(config.lastVideo).startsWith("https://") ? config.lastVideo : "https://discord.com/",
            disabled: String(config.lastVideo).startsWith("https://") ? false : true
          })
        ]
      }));

      if (availableChannels.includes(message.channel.id)) {
        if (blacklist) {
          const reason = db.fetch(`BlackList.Member_${member.id}.Reason`) ?? "Sebep Belirtilmedi.";
          const employee = await guild.members.resolve(db.fetch(`BlackList.Member_${member.id}.Employee`));
          const date = db.fetch(`BlackList.Member_${member.id}.Date`);

          embeds.push(new this.Embed({
            title: `${this.client.user.username} - Abone Sistemi | KaraListe Kullanıcısı`,
            description: `${this.config.Emoji.Other.TRASH} Maalesef karalistede bulunuyorsun aşağıdan neden karalistede olduğun hakkında bilgi edin!`,
            fields: [
              {
                name: `${this.config.Emoji.Other.ADMIN} Yetkili`,
                value: `- ${employee}`,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
                value: `- <t:${date}:R>`,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.NOTEPAD} Sebep`,
                value: `- ${reason}`
              }
            ],
            author: {
              name: `${user.tag} | ${user.id}`,
              iconURL: guild?.iconURL()
            },
            thumbnail: {
              url: user?.avatarURL()
            }
          }));
        } else {
          embeds.push(new this.Embed({
            title: `${this.client.user.username} - Abone Sistemi`,
            description: `Attığın Fotoğraf Eğer \`SON VIDEO\` __**DEĞİL**__ ise \`Like\`, \`Yorum\` ve \`Bildirim\` __**YOKSA**__ Abone Rolünüz __**VERİLME*Z***__ \n\n**Bilgisayar Saatinin Gözüktüğünden __EMİN OL__**`,
            fields: [
              {
                name: `${this.config.Emoji.Other.YES} Rolü Ver`,
                value: `\`/subscribe add mention:${member.id}\``
              }
            ],
            author: {
              name: `${user.tag} | ${user.id}`,
              iconURL: guild?.iconURL()
            },
            thumbnail: {
              url: member?.displayAvatarURL()
            }
          }));
        };

        if (message.channel.id === availableChannels[0]) {
          if (this.client.user.id !== "944965150358790185") return;

          mention = blacklist ? `<@${member.id}>` : `<@${member.id}> | <@&${config.employee}>`;

          return (await client.channels.resolve(availableChannels[0])).send({ content: `${this.config.Emoji.Other.ACTIVITY} ${mention}`, embeds, components });
        };

        if (message.channel.id === availableChannels[1]) {
          mention = `<@${member.id}>`;

          return (await client.channels.resolve(availableChannels[1])).send({ content: `${this.config.Emoji.Other.ACTIVITY} ${mention}`, embeds, components });
        };
      };
    };
  };
};