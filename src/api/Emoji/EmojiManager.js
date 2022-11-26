import { Manager } from "../Manager.js";

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
      const emoji = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/emojis/${emojiID}`);

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
      const emoji = await Manager.POST(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/emojis`, {
        name: options?.name,
        image: options?.image,
        roles: options?.roles
      });

      return emoji;
    };

    this.edit = async function (emojiID, options = {
      name: "new_emoji",
      roles: []
    }) {
      if (typeof emojiID !== "string") throw new TypeError("EmojiID must be a STRING!");

      const fetchEmoji = await client.emojis.resolve(emojiID);
      const emoji = await Manager.PATCH(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${fetchEmoji.guild.id}/emojis/${fetchEmoji.id}`, {
        name: options?.name,
        roles: options?.roles
      });

      return emoji;
    };

    this.delete = async function (emojiID) {
      if (typeof emojiID !== "string") throw new TypeError("EmojiID must be a STRING!");

      const fetchEmoji = await client.emojis.resolve(emojiID);
      const emoji = await Manager.DELETE(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${fetchEmoji.guild.id}/emojis/${fetchEmoji.id}`);

      return emoji;
    };

    this.map = async function (guildID) {
      if (typeof guildID !== "string") throw new TypeError("GuildID must be a STRING!");
      if (!Array.isArray(storage)) throw new TypeError("Storage Must be a ARRAY!");

      const guild = await GuildManager.get(guildID);
      const emojis = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/emojis`);

      return emojis;
    };

    this.cache = EmojiCache;

    this.handleCache = async function (client_, debug) {
      await Promise.all(client_.guilds.cache.map(async (guild) => {
        await Promise.all(guild.emojis.cache.map((emoji) => {
          if (debug) console.log(chalk.grey(`[EmojiCacheManager] ${emoji.name} (${emoji.id}) was handled and cached.`));

          this.cache.set(emoji.name, emoji);
          this.cache.set(emoji.id, emoji);
        }));
      }));
    };
  };
};