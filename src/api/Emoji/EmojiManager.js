import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import { EmojiCache } from "./EmojiCache.js";

import ora from "ora";

export class EmojiManager {
  constructor(client) {
    this.client = client;
  };

  cache = EmojiCache;

  async handleCache(debug = false) {
    if (!api.checker.check(debug).isBoolean()) api.checker.error("debug", "InvalidType", { expected: "Boolean", received: (typeof debug) });

    let spinner = ora("[CacheManager(Emoji)] Initiating caching.");

    if (debug) spinner.start();

    await Promise.all(this.client.guilds.cache.map(async (guild) => {
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

  get(guildID, emojiID) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
    if (!api.checker.check(emojiID).isString()) api.checker.error("emojiId", "InvalidType", { expected: "String", received: (typeof emojiID) });

    const guild = GuildManager.get(guildID);
    const emoji = GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/emojis/${emojiID}`);

    return emoji;
  };

  getById(emojiID, callback) {
    if (!api.checker.check(emojiID).isString()) api.checker.error("emojiId", "InvalidType", { expected: "String", received: (typeof emojiID) });
    if (!api.checker.check(callback).isFunction()) callback = function () { };

    const emojis = (client.emojis.cache.filter((emoji) => emoji.id === emojiID).map((e) => e));

    return callback(emojis);
  };

  getByName(emojiName, callback) {
    if (!api.checker.check(emojiID).isString()) api.checker.error("emojiName", "InvalidType", { expected: "String", received: (typeof emojiName) });
    if (!api.checker.check(callback).isFunction()) callback = function () { };

    const emojis = (client.emojis.cache.filter((emoji) => emoji.name === emojiName).map((e) => e));

    return callback(emojis);
  };

  create(guildID, options = {
    name: "new_emoji",
    image: null,
    roles: []
  }) {
    if (!api.checker.isString(guildID)) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });

    const guild = GuildManager.get(guildID);
    const emoji = POST(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/emojis`, {
      json: {
        name: options?.name,
        image: options?.image,
        roles: options?.roles
      }
    });

    return emoji;
  };

  edit(emojiID, options = {
    name: "new_emoji",
    roles: []
  }) {
    if (!api.checker.check(emojiID).isString()) api.checker.error("emojiId", "InvalidType", { expected: "String", received: (typeof emojiID) });

    const fetchEmoji = client.emojis.resolve(emojiID);
    const emoji = PATCH(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${fetchEmoji.guild.id}/emojis/${fetchEmoji.id}`, {
      json: {
        name: options?.name,
        roles: options?.roles
      }
    });

    return emoji;
  };

  delete(emojiID) {
    if (!api.checker.check(emojiID).isString()) api.checker.error("emojiId", "InvalidType", { expected: "String", received: (typeof emojiID) });

    const fetchEmoji = client.emojis.resolve(emojiID);
    const emoji = DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${fetchEmoji.guild.id}/emojis/${fetchEmoji.id}`);

    return emoji;
  };

  map(guildID) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });

    const guild = GuildManager.get(guildID);
    const emojis = GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/emojis`);

    return emojis;
  };
};