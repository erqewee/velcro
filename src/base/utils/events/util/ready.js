import { Event } from "../../../structures/export.js";

import { YouTube } from "../../../classes/YouTube.js";

import ms from "ms";

import { ActivityType as Type } from "discord.js";

export default class extends Event {
  constructor() {
    super({ enabled: true });

    this.setName(this.Events.Discord.ClientReady);

    this.setModes("once");
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
      const statuses = [ "online", "idle", "dnd" ];
      const activities = [ `${this.client.user.username} is coming...`, `⚡ SkyLegend is best discord server!` ];
      const activitiesTypes = [ Type.Playing, Type.Listening, Type.Watching, Type.Competing ];

      if (statusCounter > (statuses.length - 1)) statusCounter = 0;
      if (activityCounter > (activities.length - 1)) activityCounter = 0;
      if (activityStatusCounter > (activitiesTypes.length - 1)) activityStatusCounter = 0;

      this.client.user.setStatus(statuses[ statusCounter ]);
      this.client.user.setActivity(activities[ activityCounter ], { type: activitiesTypes[ activityStatusCounter ] });

      statusCounter++;
      activityCounter++;
      activityStatusCounter++;
    }, 10000);

    const date = this.time(Date.now(), { onlyNumberOutput: true });

    const client = this.client;
    const db = this.databases.subscribe;
    const youtube = new YouTube(this.client, this.config.Data.Configurations.YOUTUBE_CHANNEL, db);

    const guild = client.guilds.resolve(this.config.Data.Configurations.SUPPORT_SERVER);

    const config = {
      employee: db.fetch(`Subscribe.Settings.EmployeeRole`),
      log: db.fetch(`Subscribe.Settings.LogChannel`),
      password: db.fetch(`Subscribe.Settings.Password`),
      subscribe: db.fetch(`Subscribe.Settings.SubscribeRole`),
      subscribeChannel: db.fetch(`Subscribe.Settings.SubscribeChannel`)
    };

    const voiceChannels = this.config.Data.Configurations.VOICE_CHANNELS;
    if (!Array.isArray(voiceChannels)) throw new Error("InvalidType", "'VoiceChannels' is not a 'Array'.");

    if (voiceChannels?.length > 0) {
      for (let index = 0; index < voiceChannels.length; index++) {
        const channel = this.channels.cache.fetch(voiceChannels[ index ]);

        const connection = await this.connections.get(channel.guild);

        if (!connection) this.connections.create(channel);
      };
    };

    const Embed = this.Embed;
    const configDef = this.config;

    setInterval(() => {
      const subscribes = db.fetch("Subscribe.Members");
      if (!subscribes || subscribes.length < 1) return;

      subscribes.map(async (data) => {
        const user = await client.users.fetch(data.id);

        const fetchData = db.fetch("Subscribe.Members")?.filter((value) => value.id === user.id)[ 0 ];

        if (fetchData?.employee && !guild.members.cache.get(user.id)) {
          db.pull("Subscribe.Members", (value) => value.id === user.id);
          db.push("Subscribe.BlackList", { id: user.id, reason: "Automatic Process", employee: client.user.id, date: date });

          const embed = new Embed({
            title: this.translate("data:events.ready.blacklist.title", { variables: [ { name: "client.user.tag", value: client.user.tag } ] }),
            description: this.translate("data:events.ready.blacklist.description", { variables: [ { name: "successEmote", value: configDef.Emoji.State.SUCCESS } ] }),
            fields: [
              {
                name: this.translate("data:events.ready.blacklist.fields.employee", { variables: [ { name: "employeeEmote", value: configDef.Emoji.Other.ADMIN } ] }),
                value: `- ${client.user}`,
                inline: true
              },
              {
                name: this.translate("data:events.ready.blacklist.fields.date", { variables: [ { name: "calendarEmote", value: configDef.Emoji.Other.CALENDAR } ] }),
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

          return client.channels.resolve(config.log).send({ embeds: [ embed ] });
        };
      });
    }, ms("1h"));

    setInterval(() => {
      guild.members.cache.map((member) => {
        if (member.roles.highest.id === config.subscribe) {
          const name = String(member.displayName);

          if (!name.startsWith("🔰")) member.setNickname(`🔰 ${name}`);
        };

        const fetchData = db.fetch("Subscribe.Members")?.filter((data) => data.id === member.id)[ 0 ];

        if (member.roles.cache.has(config.subscribe) && !fetchData?.employee) db.push("Subscribe.Members", { id: member.id, employee: client.user.id, date: date });
        if (!member.roles.cache.has(config.subscribe) && fetchData?.employee) {
          db.pull("Subscribe.Members", (data) => data.id === member.id);

          const name = String(member.displayName);
          if (name.startsWith("🔰")) member.setNickname(name.slice(1));
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