import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import { EmojiCache } from "./EmojiCache.js";

import chalk from "chalk";

export class EmojiManager {
  constructor(client) {
    this.get = async function (guildID, emojiID) {
      if (typeof emojiID !== "string") throw new TypeError("EmojiID must be a STRING!");
      if (typeof guildID !== "string") throw new TypeError("GuildID must be a STRING!");

      const guild = await GuildManager.get(guildID);
      const emoji = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/emojis/${emojiID}`);

      return emoji;
    };

    this.getById = async function (emojiID, callback) {
      if (!callback) callback = function () { };
      if (typeof emojiID !== "string") throw new TypeError("EmojiID must be a STRING!");

      const emojis = client.emojis.cache.filter((emoji) => emoji.id === emojiID).map((e) => e);

      return await callback(emojis);
    };

    this.getByName = async function (emojiName, callback) {
      if (!callback) callback = function () { };
      if (typeof emojiName !== "string") throw new TypeError("Emoji Name must be a STRING!");

      const emojis = client.emojis.cache.filter((emoji) => emoji.name === emojiName).map((e) => e);

      return await callback(emojis);
    };

    this.create = async function (guildID, options = {
      name: "new_emoji",
      image: null,
      roles: []
    }) {
      if (typeof guildID !== "string") throw new TypeError("GuildID must be a STRING!");

      const guild = await GuildManager.get(guildID);
      const emoji = await POST(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/emojis`, {
        json: {
          name: options?.name,
          image: options?.image,
          roles: options?.roles
        }
      });

      return emoji;
    };

    this.edit = async function (emojiID, options = {
      name: "new_emoji",
      roles: []
    }) {
      if (typeof emojiID !== "string") throw new TypeError("EmojiID must be a STRING!");

      const fetchEmoji = await client.emojis.resolve(emojiID);
      const emoji = await PATCH(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${fetchEmoji.guild.id}/emojis/${fetchEmoji.id}`, {
        json: {
          name: options?.name,
          roles: options?.roles
        }
      });

      return emoji;
    };

    this.delete = async function (emojiID) {
      if (typeof emojiID !== "string") throw new TypeError("EmojiID must be a STRING!");

      const fetchEmoji = client.emojis.resolve(emojiID);
      const emoji = await DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${fetchEmoji.guild.id}/emojis/${fetchEmoji.id}`);

      return emoji;
    };

    this.map = async function (guildID) {
      if (typeof guildID !== "string") throw new TypeError("GuildID must be a STRING!");
      if (!Array.isArray(storage)) throw new TypeError("Storage Must be a ARRAY!");

      const guild = await GuildManager.get(guildID);
      const emojis = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/emojis`);

      return emojis;
    };

    this.cache = EmojiCache;

    this.handleCache = async function (client_, debug) {
      return client_.guilds.cache.map(async (guild) => {
        return guild.emojis.cache.map((emoji) => {
          if (debug) console.log(chalk.grey(`[EmojiCacheManager] ${emoji.name} (${emoji.id}) was handled and cached.`));

          return this.cache.set(emoji.id, emoji);
        });
      });
    };
  };
};