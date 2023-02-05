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
    const debugError = new api.checker.BaseChecker(debug).Error;
    debugError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'debug'.")
      .setCondition("isNotBoolean")
      .setType("InvalidType")
      .throw();

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
   * @param {object} guild
   * @param {string} emojiID 
   * @returns {Promise<GuildEmoji>}
   */
  async get(guild, emojiID) {
    const guildError = new api.checker.BaseChecker(guildID).Error;
    guildError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'guild'.")
      .setCondition("isNotObject")
      .setType("InvalidType")
      .throw();

    const emojiError = new api.checker.BaseChecker(emojiID).Error;
    emojiError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'emoji'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const emojiGuild = await GuildManager.get(guild);
    const fetched = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${emojiGuild.id}/emojis/${emojiID}`);

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
    const emojiError = new api.checker.BaseChecker(emojiName).Error;
    emojiError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'emojiName'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const callbackError = new api.checker.BaseChecker(callback).Error;
    callbackError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'callback'.")
      .setCondition("isNotFunction")
      .setType("InvalidType")
      .throw();

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
    const guildError = new api.checker.BaseChecker(guildID).Error;
    guildError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'guildId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

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
    const emojiError = new api.checker.BaseChecker(emojiID).Error;
    emojiError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'emojiId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

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
   * @returns {void}
   */
  delete(emojiID) {
    const emojiError = new api.checker.BaseChecker(emojiID).Error;
    emojiError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'emojiId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const fetched = client.emojis.resolve(emojiID);
    DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${fetched.guild.id}/emojis/${fetched.id}`);

    this.cache.delete(fetched.id);

    return void 0;
  };

  /**
   * Lists all emojis of the specified server.
   * @param {string} guildID 
   * @returns {Promise<GuildEmoji>[]}
   */
  async map(guildID) {
    const guildError = new api.checker.BaseChecker(guildID).Error;
    guildError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'guildId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const guild = await GuildManager.get(guildID);
    const emojis = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/emojis`);

    const arrayEmojis = [];

    if (emojis.length > 0) for (let index = 0; index < emojis.length; index++) arrayEmojis.push(client.emojis.resolve(emojis[ index ].id));

    return arrayEmojis;
  };
};