import { Manager } from "../Manager.js";

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import { MemberCache } from "./MemberCache.js";

import chalk from "chalk";

export class MemberManager {
  constructor() {
    this.get = async function (guildID, memberID) {
      if (typeof guildID !== "string") throw new TypeError("GuildID must be a STRING!");
      if (typeof memberID !== "string") throw new TypeError("MemberID must be a STRING!");

      const guild = await GuildManager.get(guildID);
      const member = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/members/${memberID}`);

      return member;
    };

    this.ban = {
      add: async function (guildID, memberID, options = {
        deleteMessageDays: 0,
        deleteMessageSeconds: 604800
      }) {
        if (typeof guildID !== "string") throw new TypeError("GuildID must be a STRING!");
        if (typeof memberID !== "string") throw new TypeError("MemberID must be a STRING!");

        const guild = await GuildManager.get(guildID);
        const member = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/members/${memberID}`);

        const banned = await Manager.PUT(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/bans/${member.id}`, {
          delete_message_days: options?.deleteMessageDays,
          delete_message_seconds: options?.deleteMessageSeconds
        });

        return banned;
      },

      remove: async function (guildID, memberID) {
        if (typeof guildID !== "string") throw new TypeError("GuildID must be a STRING!");
        if (typeof memberID !== "string") throw new TypeError("MemberID must be a STRING!");

        const guild = await GuildManager.get(guildID);
        const member = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/users/${memberID}`);

        const unbanned = await Manager.DELETE(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/bans/${member.id}`);

        return unbanned;
      },

      get: async function (guildID, memberID) {
        if (typeof guildID !== "string") throw new TypeError("GuildID must be a STRING!");
        if (typeof memberID !== "string") throw new TypeError("MemberID must be a STRING!");

        const guild = await GuildManager.get(guildID);
        const member = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/users/${memberID}`);

        const get = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/bans/${member.id}`);

        return get;
      },

      map: async function (guildID) {
        if (typeof guildID !== "string") throw new TypeError("GuildID must be a STRING!");

        const guild = await GuildManager.get(guildID);

        const bans = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/bans`);

        return bans;
      },
    };

    this.edit = async function(guildID, memberID, options = {
      nick: null,
      roles: [],
      mute: false,
      deaf: false,
      channelId: null,
      communicationDisabledUntil: null
    }) {
      if (typeof guildID !== "string") throw new TypeError("GuildID must be a STRING!");
      if (typeof memberID !== "string") throw new TypeError("MemberID must be a STRING!");

      const guild = await GuildManager.get(guildID);
      const member = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/members/${memberID}`);

      const edited = await Manager.PATCH(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/members/${member.id}`, {
        nick: options?.nick,
        roles: options?.roles,
        mute: options?.mute,
        deaf: options?.deaf,
        channel_id: options?.channelId,
        communication_disabled_until: options?.communicationDisabledUntil
      });

      return edited;
    };

    this.map = async function(guildID) {
      if (typeof guildID !== "string") throw new TypeError("GuildID must be a STRING!");

      const guild = await GuildManager.get(guildID);

      const members = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/members`);

      return members;
    };

    this.search = async function(guildID, options = {
      query: null,
      limit: 1
    }) {
      if (typeof guildID !== "string") throw new TypeError("GuildID must be a STRING!");

      const guild = await GuildManager.get(guildID);

      const indexed = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/members/search`, {
        query: options?.query,
        limit: options?.limit
      });

      return indexed;
    };

    this.cache = MemberCache;

    this.handleCache = async function (client_, debug) {
      await Promise.all(client_.guilds.cache.map(async (guild) => {
        await Promise.all(guild.members.cache.map((member) => {
          if (debug) console.log(chalk.grey(`[MemberCacheManager] ${member.user.tag} (${member.id}) was handled and cached.`));

          return this.cache.set(member.id, member);
        }));
      }));
    };
  };
};