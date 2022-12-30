import { Event } from "../../structures/export.js";

import { YouTube } from "../../classes/YouTube.js";

import ms from "ms";

import { ActivityType as Type } from "discord.js";

export default class extends Event {
  constructor() {
    super({ enabled: true });

    this.setName(this.Events.Discord.ClientReady);

    this.setModes(["once"]);
  };

  async execute() {
    this.members.handleCache();
    this.invites.handleCache();
    this.guilds.handleCache();
    this.emojis.handleCache();
    this.channels.handleCache();

    let activityCounter = 0;
    let activityStatusCounter = 0;
    let statusCounter = 0;

    setInterval(() => {
      const statuses = ["online", "idle", "dnd"];
      const activities = [`${this.client.user.username} is coming...`, `⚡ SkyLegend is best discord server!`];
      const activitiesTypes = [Type.Playing, Type.Listening, Type.Watching, Type.Competing];

      if (statusCounter > (statuses.length - 1)) statusCounter = 0;
      if (activityCounter > (activities.length - 1)) activityCounter = 0;
      if (activityStatusCounter > (activitiesTypes.length - 1)) activityStatusCounter = 0;

      this.client.user.setStatus(statuses[statusCounter]);
      this.client.user.setActivity(activities[activityCounter], { type: activitiesTypes[activityStatusCounter] });

      statusCounter++;
      activityCounter++;
      activityStatusCounter++;
    }, 10000);

    const date = Math.floor(Date.now() / 1000);

    const client = this.client;
    const db = this.databases.subscribe;
    const youtube = new YouTube(this.client, "UCjtU9nHOAo6XpJCF9qb-1Ow", db);

    const guild = client.guilds.resolve("942839259876958268");

    const channel = this.channels.cache.get("995366410056376410");

    const config = {
      employee: db.fetch(`Subscribe.Settings.EmployeeRole`),
      log: db.fetch(`Subscribe.Settings.LogChannel`),
      password: db.fetch(`Subscribe.Settings.Password`),
      subscribe: db.fetch(`Subscribe.Settings.SubscribeRole`),
      subscribeChannel: db.fetch(`Subscribe.Settings.SubscribeChannel`)
    };

    if (!this.connections.get(channel.guild.id)) this.connections.create(channel.id);

    const Embed = this.Embed;
    const configDef = this.config;

    setInterval(() => {
      const subscribes = db.fetch("Subscribe.Members");
      if (!subscribes || subscribes.length < 1) return;

      subscribes.map(async (USER_ID) => {
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

          return client.channels.resolve(config.log).send({ embeds: [embed] });
        };
      });
    }, ms("1h"));

    setInterval(() => {
      guild.members.cache.map((member) => {
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

    setInterval(async () => {
      const uploads = await youtube.checkUploads();
      return uploads.sendAnnounce("944681810976194620");
    }, 5000);

    /*setInterval(() => { // Guild Status with Channels
      const baseCategory = guild.channels.resolve("1042816887052042281");

      const statusChannel = guild.channels.cache.get("995248486612226058");
      const allChannel = guild.channels.cache.get("995366410056376410");

      let onlineCount = guild.members.cache.filter((member) => member.presence?.status === "online" && !member.user.bot && !member.roles.cache.has("942843002391502908")).size;
      let idleCount = guild.members.cache.filter((member) => member.presence?.status === "idle" && !member.user.bot && !member.roles.cache.has("942843002391502908")).size;
      let dndCount = guild.members.cache.filter((member) => member.presence?.status === "dnd" && !member.user.bot && !member.roles.cache.has("942843002391502908")).size;

      let memberCount = guild.members.cache.filter((member) => !member.user.bot).size;
      let botCount = guild.members.cache.filter((member) => member.user.bot).size;
      let unregCount = guild.members.cache.filter((member) => !member.user.bot && member.roles.cache.has("942843002391502908")).size;

      baseCategory.setName(`👤 ${memberCount} | 📋 ${unregCount} | 🤖 ${botCount}`);
      statusChannel.setName(`🟢 ${onlineCount} | 🌙 ${idleCount} | 🔴 ${dndCount}`);
      allChannel.setName(`🔢 ${onlineCount + idleCount + dndCount}`);

      console.log("Status updated.");
    }, 30000);
    */
  };
}; 