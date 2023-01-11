import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import { MembersCache as MemberCache } from "../Caches.js";

import ora from "ora";

import Discord, { Client } from "discord.js";
const { GuildMember, User, GuildBan } = Discord;

export class MemberManager {
  constructor(client) {
    this.client = client;
  };

  /**
   * Cache for guild members.
   */
  cache = MemberCache;

  /**
   * It saves guild members in the cache.
   * @param {boolean} debug 
   * @returns {boolean}
   */
  async handleCache(debug = false) {
    const debugChecker = new api.checker.BaseChecker(debug);
    debugChecker.createError(!debugChecker.isBoolean, "debug", { expected: "Boolean", received: debugChecker }).throw();

    let spinner = ora("[CacheManager(Member)] Initiating caching.");

    if (debug) spinner.start();

    await Promise.all(client.guilds.cache.map(async (guild) => {
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

  /**
   * It assigns the data of the member whose ID is specified from the server whose ID is specified.
   * @param {string} guildID 
   * @param {string} memberID 
   * @returns {Promise<GuildMember>}
   */
  async get(guildID, memberID) {
    const guildChecker = new api.checker.BaseChecker(guildID);
    guildChecker.createError(!guildChecker.isString, "guildId", { expected: "String", received: guildChecker }).throw();

    const memberChecker = new api.checker.BaseChecker(memberID);
    memberChecker.createError(!memberChecker.isString, "memberId", { expected: "String", received: memberChecker }).throw();

    const guild = await GuildManager.get(guildID);
    const fetched = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/${memberID}`);

    const member = client.guilds.resolve(guild.id).members.resolve(fetched.id);

    return member;
  };

  ban = {
    /**
     * Bans the user whose ID is specified from the server whose ID is specified.
     * @param {string} guildID 
     * @param {string} memberID 
     * @param {object} options 
     * @returns {Promise<User>}
     */
    add: async function (guildID, memberID, options = {
      deleteMessageDays: 14,
      deleteMessageSeconds: 604800
    }) {
      const guildChecker = new api.checker.BaseChecker(guildID);
      guildChecker.createError(!guildChecker.isString, "guildId", { expected: "String", received: guildChecker }).throw();

      const memberChecker = new api.checker.BaseChecker(memberID);
      memberChecker.createError(!memberChecker.isString, "memberId", { expected: "String", received: memberChecker }).throw();

      const guild = await GuildManager.get(guildID);
      const fetched = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/${memberID}`);

      const banned = await PUT(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/bans/${fetched.id}`, {
        json: {
          delete_message_days: options?.deleteMessageDays,
          delete_message_seconds: options?.deleteMessageSeconds
        }
      });

      const user = await client.users.fetch(fetched.id);

      return user;
    },

    /**
     * Removes Ban the user whose ID is specified from the server whose ID is specified.
     * @param {string} guildID 
     * @param {string} memberID 
     * @param {object} options 
     * @returns {Promise<User>}
     */
    remove: async function (guildID, memberID) {
      const guildChecker = new api.checker.BaseChecker(guildID);
      guildChecker.createError(!guildChecker.isString, "guildId", { expected: "String", received: guildChecker }).throw();

      const memberChecker = new api.checker.BaseChecker(memberID);
      memberChecker.createError(!memberChecker.isString, "memberId", { expected: "String", received: memberChecker }).throw();

      const guild = await GuildManager.get(guildID);
      const fetched = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/users/${memberID}`);

      DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/bans/${fetched.id}`);

      const user = await client.users.fetch(fetched.id);

      return user;
    },

    /**
     * Retrieves the information of the banned member from the server whose ID is specified. 
     * @param {string} guildID 
     * @param {string} memberID 
     * @returns {Promise<GuildBan>} 
     */
    get: async function (guildID, memberID) {
      const guildChecker = new api.checker.BaseChecker(guildID);
      guildChecker.createError(!guildChecker.isString, "guildId", { expected: "String", received: guildChecker }).throw();

      const memberChecker = new api.checker.BaseChecker(memberID);
      memberChecker.createError(!memberChecker.isString, "memberId", { expected: "String", received: memberChecker }).throw();

      const guild = await GuildManager.get(guildID);
      const fetched = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/users/${memberID}`);

      const get = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/bans/${fetched.id}`);

      return get;
    },

    /**
     * Lists all bans of the server whose ID is entered.
     * @param {string} guildID 
     * @returns {Promise<GuildBan[]>}
     */
    map: async function (guildID) {
      const guildChecker = new api.checker.BaseChecker(guildID);
      guildChecker.createError(!guildChecker.isString, "guildId", { expected: "String", received: guildChecker }).throw();

      const guild = await GuildManager.get(guildID);

      const bans = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/bans`);

      const bannedArray = [];

      if (bans.length > 0) for (let index = 0; index < bans.length; index++) bannedArray.push(bans[index]);

      return bannedArray;
    }
  };

  /**
   * Edits the user whose ID you specify on the server whose ID is specified.
   * @param {string} guildID 
   * @param {string} memberID 
   * @param {object} options 
   * @returns {Promise<GuildMember>}
   */
  async edit(guildID, memberID, options = {
    nick: null,
    roles: [],
    mute: false,
    deaf: false,
    channelId: null,
    communicationDisabledUntil: null
  }) {
    const guildChecker = new api.checker.BaseChecker(guildID);
    guildChecker.createError(!guildChecker.isString, "guildId", { expected: "String", received: guildChecker }).throw();

    const memberChecker = new api.checker.BaseChecker(memberID);
    memberChecker.createError(!memberChecker.isString, "memberId", { expected: "String", received: memberChecker }).throw();

    const guild = await GuildManager.get(guildID);
    const fetched = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/${memberID}`);

    const edited = await PATCH(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/${fetched.id}`, {
      json: {
        nick: options?.nick,
        roles: options?.roles,
        mute: options?.mute,
        deaf: options?.deaf,
        channel_id: options?.channelId,
        communication_disabled_until: options?.communicationDisabledUntil
      }
    });

    const member = client.guilds.resolve(guild.id).members.resolve(edited.id);

    return member;
  };

  /**
   * Lists all members on the server with the specified ID.
   * @param {string} guildID 
   * @returns {Promise<GuildMember[]>}
   */
  async map(guildID) {
    const guildChecker = new api.checker.BaseChecker(guildID);
    guildChecker.createError(!guildChecker.isString, "guildId", { expected: "String", received: guildChecker }).throw();

    const guild = await GuildManager.get(guildID);

    const members = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members`);

    const membersArray = [];

    if (members.length > 0) for (let index = 0; index < members.length; index++) membersArray.push(client.guilds.resolve(guild.id).members.resolve(members[index].id));

    return membersArray;
  };

  /**
   * Searches for a member on the server whose ID is specified.
   * @param {string} guildID 
   * @param {string} options 
   * @returns {Promise<GuildMember[]>}
   */
  async search(guildID, options = {
    query: null,
    limit: 1
  }) {
    const guildChecker = new api.checker.BaseChecker(guildID);
    guildChecker.createError(!guildChecker.isString, "guildId", { expected: "String", received: guildChecker }).throw();

    const guild = await GuildManager.get(guildID);

    const indexed = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/members/search`, {
      json: {
        query: options?.query,
        limit: options?.limit
      }
    });

    const indexedArray = [];

    if (indexed.length > 0) for (let index = 0; index < indexed.length; index++) indexedArray.push(client.guilds.resolve(guild.id).members.resolve(indexed[index].id));

    return indexedArray;
  };
};