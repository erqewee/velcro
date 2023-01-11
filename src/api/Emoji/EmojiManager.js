import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import { EmojisCache as EmojiCache } from "../Caches.js";

import ora from "ora";

import Discord from "discord.js";
const { GuildEmoji } = Discord;

export class EmojiManager {
  constructor(client) {
    client = client;
  };
  
  /**
   * Cache for emojis.
   */
  cache = EmojiCache;

  /**
   * It saves emojis in the cache.
   * @param {boolean} debug 
   * @returns {boolean}
   */
  async handleCache(debug = false) {
    const debugChecker = new api.checker.BaseChecker(debug);
    debugChecker.createError(!debugChecker.isBoolean, "debug", { expected: "Boolean", received: debugChecker }).throw();

    let spinner = ora("[CacheManager(Emoji)] Initiating caching.");

    if (debug) spinner.start();

    await Promise.all(client.guilds.cache.map(async (guild) => {
      await Promise.all(guild.emojis.cache.map((emoji) => {
        const { id, name } = emoji;

        if (debug) {
          spinner.text = `[CacheManager(Emoji)] ${name} (${id}) was handled and cached.`;

          spinner = spinner.render().start();
        };

        return this.cache.set(id, emoji);
      }));
    })).then(() => debug ? spinner.succeed("[CacheManager(Emoji)] Caching completed!") : null).catch((err) => debug ? spinner.fail(`[CacheManager(Emoji)] An error occurred while caching. | ${err}`) : null);

    return debug;
  };

  /**
   * Get the information of the specified emoji from the specified server.
   * @param {string} guildID 
   * @param {string} emojiID 
   * @returns {Promise<GuildEmoji>}
   */
  async get(guildID, emojiID) {
    const guildChecker = new api.checker.BaseChecker(guild);
    guildChecker.createError(!guildChecker.isString, "guild", { expected: "String", received: guildChecker }).throw();

    const emojiChecker = new api.checker.BaseChecker(emoji);
    emojiChecker.createError(!emojiChecker.isString, "emoji", { expected: "String", received: emojiChecker }).throw();

    const guild = await GuildManager.get(guildID);
    const fetched = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/emojis/${emojiID}`);

    const emoji = client.emojis.resolve(fetched.id);

    return emoji;
  };

  /**
   * Searches all servers for the emoji whose name is entered.
   * @param {string} emojiName 
   * @param {Function} callback 
   * @returns {Function}
   */
  getByName(emojiName, callback = function () { }) {
    const emojiChecker = new api.checker.BaseChecker(emojiName);
    emojiChecker.createError(!emojiChecker.isString, "emojiName", { expected: "String", received: emojiChecker }).throw();

    const callbackChecker = new api.checker.BaseChecker(callback);
    callbackChecker.createError(!callbackChecker.isFunction, "callback", { expected: "Function", received: callbackChecker }).throw();

    const emojis = (client.emojis.cache.filter((emoji) => emoji.name === emojiName).map((e) => e));

    return callback(emojis);
  };

  /**
   * Creates a new Discord Guild Emoji.
   * @param {string} guildID 
   * @param {object} options 
   * @returns {Promise<GuildEmoji>}
   */
  async create(guildID, options = {
    name: "new_emoji",
    image: null,
    roles: []
  }) {
    const guildChecker = new api.checker.BaseChecker(guild);
    guildChecker.createError(!guildChecker.isString, "guild", { expected: "String", received: guildChecker }).throw();

    const guild = await GuildManager.get(guildID);
    const createdEmoji = await POST(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/emojis`, {
      json: {
        name: options?.name,
        image: options?.image,
        roles: options?.roles
      }
    });

    const emoji = client.emojis.resolve(createdEmoji.id);

    this.cache.set(emoji.id, emoji);

    return emoji;
  };

  /**
   * Edits a Discord Guild Emoji.
   * @param {string} emojiID 
   * @param {object} options 
   * @returns 
   */
  async edit(emojiID, options = {
    name: "new_emoji",
    roles: []
  }) {
    const emojiChecker = new api.checker.BaseChecker(emojiID);
    emojiChecker.createError(!emojiChecker.isString, "emojiId", { expected: "String", received: emojiChecker }).throw();

    const fetched = client.emojis.resolve(emojiID);
    const editedEmoji = await PATCH(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${fetched.guild.id}/emojis/${fetched.id}`, {
      json: {
        name: options?.name,
        roles: options?.roles
      }
    });

    const emoji = client.emojis.resolve(editedEmoji.id);

    return emoji;
  };

  /**
   * Deletes a Discord Guild Emoji.
   * @param {string} emojiID 
   * @returns {number}
   */
  delete(emojiID) {
    const emojiChecker = new api.checker.BaseChecker(emojiID);
    emojiChecker.createError(!emojiChecker.isString, "emojiId", { expected: "String", received: emojiChecker }).throw();

    const fetched = client.emojis.resolve(emojiID);
    DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${fetched.guild.id}/emojis/${fetched.id}`);

    this.cache.delete(fetched.id);

    return 0;
  };

  /**
   * Lists all emojis of the specified server.
   * @param {string} guildID 
   * @returns {Promise<GuildEmoji>[]}
   */
  async map(guildID) {
    const guildChecker = new api.checker.BaseChecker(guildID);
    guildChecker.createError(!guildChecker.isString, "guildId", { expected: "String", received: guildChecker }).throw();

    const guild = await GuildManager.get(guildID);
    const emojis = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/emojis`);

    const arrayEmojis = [];

    if (emojis.length > 0) for (let index = 0; index < emojis.length; index++) arrayEmojis.push(client.emojis.resolve(emojis[index].id));

    return arrayEmojis;
  };
};