import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import { MemberCache } from "./MemberCache.js";

import ora from "ora";

export class MemberManager {
  constructor(client) {
    this.client = client;
  };

  cache = MemberCache;

  async handleCache(debug = false) {
    if (!api.checker.check(debug).isBoolean()) api.checker.error("debug", "InvalidType", { expected: "Boolean", received: (typeof debug) });

    let spinner = ora("[CacheManager(Member)] Initiating caching.");

    if (debug) spinner.start();

    await Promise.all(this.client.guilds.cache.map(async (guild) => {
      await Promise.all(guild.members.cache.map((member) => {
        const { user, id } = member;

        if (debug) {
          spinner.text = `[CacheManager(Member)] ${user.tag} (${id}) was handled and cached.`;

          spinner = spinner.render().start();
        };

        return this.cache.set(id, member);
      }));
    })).then(() => debug ? spinner.succeed("[CacheManager(Member)] Caching completed!") : null).catch((err) => debug ? spinner.fail(`[CacheManager(Member)] An error occurred while caching. | ${err}`) : null);

    return debug;
  };

  get(guildID, memberID) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
    if (!api.checker.check(memberID).isString()) api.checker.error("memberId", "InvalidType", { expected: "String", received: (typeof memberID) });

    const guild = GuildManager.get(guildID);
    const member = GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/${memberID}`);

    return member;
  };

  ban = {
    add: function (guildID, memberID, options = {
      deleteMessageDays: 14,
      deleteMessageSeconds: 604800
    }) {
      if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
      if (!api.checker.check(memberID).isString()) api.checker.error("memberId", "InvalidType", { expected: "String", received: (typeof memberID) });

      const guild = GuildManager.get(guildID);
      const member = GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/${memberID}`);

      const banned = PUT(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/bans/${member.id}`, {
        json: {
          delete_message_days: options?.deleteMessageDays,
          delete_message_seconds: options?.deleteMessageSeconds
        }
      });

      return banned;
    },

    remove: function (guildID, memberID) {
      if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
      if (!api.checker.check(memberID).isString()) api.checker.error("memberId", "InvalidType", { expected: "String", received: (typeof memberID) });

      const guild = GuildManager.get(guildID);
      const member = GET(`${api.config.BASE_URL}/${api.config.VERSION}/users/${memberID}`);

      const unbanned = DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/bans/${member.id}`);

      return unbanned;
    },

    get: function (guildID, memberID) {
      if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
      if (!api.checker.check(memberID).isString()) api.checker.error("memberId", "InvalidType", { expected: "String", received: (typeof memberID) });

      const guild = GuildManager.get(guildID);
      const member = GET(`${api.config.BASE_URL}/${api.config.VERSION}/users/${memberID}`);

      const get = GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/bans/${member.id}`);

      return get;
    },

    map: function (guildID) {
      if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });

      const guild = GuildManager.get(guildID);

      const bans = GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/bans`);

      return bans;
    }
  };

  edit(guildID, memberID, options = {
    nick: null,
    roles: [],
    mute: false,
    deaf: false,
    channelId: null,
    communicationDisabledUntil: null
  }) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
    if (!api.checker.check(memberID).isString()) api.checker.error("memberId", "InvalidType", { expected: "String", received: (typeof memberID) });

    const guild = GuildManager.get(guildID);
    const member = GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/${memberID}`);

    const edited = PATCH(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/${member.id}`, {
      nick: options?.nick,
      roles: options?.roles,
      mute: options?.mute,
      deaf: options?.deaf,
      channel_id: options?.channelId,
      communication_disabled_until: options?.communicationDisabledUntil
    });

    return edited;
  };

  map(guildID) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });

    const guild = GuildManager.get(guildID);

    const members = GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members`);

    return members;
  };

  search(guildID, options = {
    query: null,
    limit: 1
  }) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });

    const guild = GuildManager.get(guildID);

    const indexed = GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/search`, {
      query: options?.query,
      limit: options?.limit
    });

    return indexed;
  };
};