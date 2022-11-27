import { Event } from "../../structures/export.js";

import { YouTube } from "../../classes/YouTube.js";

import ms from "ms";

export default class extends Event {
  constructor() {
    super({
      enabled: true,
      process: false,
      once: true
    });

    this.setName(this.events.ClientReady);

    this.execute = async function () {
      const date = Math.floor(Date.now() / 1000);
      
      const client = this.client;
      const db = this.databases.subscribe;
      const youtube = new YouTube(this.client, { database: db, YouTube: { channelID: "UCjtU9nHOAo6XpJCF9qb-1Ow", userID: null } });

      const guild = await client.guilds.resolve("942839259876958268");

      this.channels.handleCache(this.client);
      this.guilds.handleCache(this.client);
      this.emojis.handleCache(this.client);
      this.members.handleCache(this.client);
      this.invites.handleCache(this.client);

      const channel = this.channels.cache.get("995366410056376410");

      const config = {
        employee: db.fetch(`Subscribe.Settings.EmployeeRole`),
        log: db.fetch(`Subscribe.Settings.LogChannel`),
        password: db.fetch(`Subscribe.Settings.Password`),
        subscribe: db.fetch(`Subscribe.Settings.SubscribeRole`),
        subscribeChannel: db.fetch(`Subscribe.Settings.SubscribeChannel`)
      };

      if (!await this.connections.get(channel.guild.id)) await this.connections.create(channel.id);

      const Embed = this.Embed;
      const configDef = this.config;

      function checkSubscribes() {
        const subscribes = db.fetch("Subscribe.Members");
        if (!subscribes || subscribes.length < 1) return;

        setInterval(() => {
          return subscribes.map(async (USER_ID) => {
            const user = await client.users.fetch(USER_ID);

            if (db.fetch(`Subscribe.Member_${user.id}`) && !guild.members.cache.get(user.id)) {
              db.del(`Subscribe.Member_${user.id}`);
              db.pull("Subscribe.Members", (data) => data === user.id);

              db.set(`BlackList.Member_${user.id}`, { State: true, Reason: "Automatic Process", Employee: client.user.id, Date: date });
              db.push("BlackList.Members", user.id);

              const embed = new Embed({
                title: `${client.user.username} - Kara Liste | Eklendi`,
                description: `${configDef.Emoji.State.SUCCESS} Bir kullanıcı karalisteye eklendi.`,
                fields: [
                  {
                    name: `${configDef.Emoji.Other.ADMIN} Yetkili`,
                    value: `- ${client.user}`,
                    inline: true
                  },
                  {
                    name: `${configDef.Emoji.Other.CALENDAR} Tarih`,
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

              return (await client.channels.resolve(config.log)).send({ embeds: [embed] });
            };
          });
        }, ms("1h"));
      };

      function scanMembers() {
        setInterval(() => {
          return guild.members.cache.map((member) => {
            if (member.roles.highest.id === config.subscribe) member.displayName.startsWith("🔰") ? null : member.setNickname(`🔰 ${member.displayName}`);

            if (member.roles.cache.has(config.subscribe) && !db.fetch(`Subscribe.Member_${member.id}`)) {
              db.set(`Subscribe.Member_${member.id}`, { Role: true, Employee: client.user.id, Date: date });
              db.push("Subscribe.Members", member.id);
            };

            if (!member.roles.cache.has(config.subscribe) && db.fetch(`Subscribe.Member_${member.id}`)) {
              db.del(`Subscribe.Member_${member.id}`);
              db.pull("Subscribe.Members", (data) => data === member.id);

              member.displayName.startsWith("🔰") ? member.setNickname(String(member.displayName).slice(1)) : null;
            };
          });
        }, ms("1h"));
      };

      scanMembers();
      checkSubscribes();

      setInterval(async () => {
        return await (await youtube.checkUploads()).sendAnnounce("944681810976194620");
      }, 5000)
    };
  };
}; 