import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import { MembersCache as MemberCache } from "../Caches.js";

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

  async get(guildID, memberID) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
    if (!api.checker.check(memberID).isString()) api.checker.error("memberId", "InvalidType", { expected: "String", received: (typeof memberID) });

    const guild = await GuildManager.get(guildID);
    const member = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/${memberID}`);

    return member;
  };

  ban = {
    add: async function (guildID, memberID, options = {
      deleteMessageDays: 14,
      deleteMessageSeconds: 604800
    }) {
      if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
      if (!api.checker.check(memberID).isString()) api.checker.error("memberId", "InvalidType", { expected: "String", received: (typeof memberID) });

      const guild = await GuildManager.get(guildID);
      const member = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/${memberID}`);

      const banned = await PUT(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/bans/${member.id}`, {
        json: {
          delete_message_days: options?.deleteMessageDays,
          delete_message_seconds: options?.deleteMessageSeconds
        }
      });

      return banned;
    },

    remove: async function (guildID, memberID) {
      if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
      if (!api.checker.check(memberID).isString()) api.checker.error("memberId", "InvalidType", { expected: "String", received: (typeof memberID) });

      const guild = await GuildManager.get(guildID);
      const member = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/users/${memberID}`);

      const unbanned = DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/bans/${member.id}`);

      return unbanned;
    },

    get: async function (guildID, memberID) {
      if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
      if (!api.checker.check(memberID).isString()) api.checker.error("memberId", "InvalidType", { expected: "String", received: (typeof memberID) });

      const guild = await GuildManager.get(guildID);
      const member = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/users/${memberID}`);

      const get = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/bans/${member.id}`);

      return get;
    },

    map: async function (guildID) {
      if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });

      const guild = await GuildManager.get(guildID);

      const bans = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/bans`);

      return bans;
    }
  };

  async edit(guildID, memberID, options = {
    nick: null,
    roles: [],
    mute: false,
    deaf: false,
    channelId: null,
    communicationDisabledUntil: null
  }) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
    if (!api.checker.check(memberID).isString()) api.checker.error("memberId", "InvalidType", { expected: "String", received: (typeof memberID) });

    const guild = await GuildManager.get(guildID);
    const member = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/${memberID}`);

    const edited = await PATCH(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/${member.id}`, {
      json: {
        nick: options?.nick,
        roles: options?.roles,
        mute: options?.mute,
        deaf: options?.deaf,
        channel_id: options?.channelId,
        communication_disabled_until: options?.communicationDisabledUntil
      }
    });

    return edited;
  };

  async map(guildID) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });

    const guild = await GuildManager.get(guildID);

    const members = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members`);

    return members;
  };

  async search(guildID, options = {
    query: null,
    limit: 1
  }) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });

    const guild = await GuildManager.get(guildID);

    const indexed = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/search`, {
      json: {
        query: options?.query,
        limit: options?.limit
      }
    });

    return indexed;
  };
};