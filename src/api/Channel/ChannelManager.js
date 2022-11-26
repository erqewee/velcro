import { Manager } from "../Manager.js";

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import { ChannelCache } from "./ChannelCache.js";

import chalk from "chalk";

export class ChannelManager {
  constructor() {
    this.get = async function (channelID) {
      if (typeof channelID !== "string") throw new TypeError("ChannelID Must be a STRING!");

      const channel = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/channels/${channelID}`);

      return channel;
    };

    this.map = async function (guildID, storage, callback) {
      if (!storage) storage = [];
      if (!callback) callback = function () { };
      if (!guildID) guildID = "";
      if (typeof guildID !== "string") throw new TypeError("GuildID Must be a STRING!");

      const channels = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/channels`);

      return channels;
    };

    this.create = async function (guildID, options = {
      name: "new-channel",
      type: 0,
      topic: null,
      bitrate: 8000,
      userLimit: 0,
      rateLimit: 0,
      position: 0,
      permissions: [],
      parent: null,
      nsfw: false,
      rtcRegion: null,
      videoQualityMode: 0,
      defaultAutoArchiveDuration: 0,
      defaultReactionEmoji: null,
      availableTags: [],
      defaultSortOrder: 0
    }) {
      if (typeof guildID !== "string") throw new TypeError("GuildID Must be a STRING!");

      const channel = await Manager.POST(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guildID}/channels`, {
        name: options?.name,
        type: options?.type,
        topic: options?.topic,
        bitrate: options?.bitrate,
        user_limit: options?.userLimit,
        rate_limit_per_user: options?.rateLimit,
        position: options?.position,
        permission_overwrites: options?.permissions,
        parent_id: options?.parent,
        nsfw: options?.nsfw,
        rtc_region: options?.rtcRegion,
        video_quality_mode: options?.videoQualityMode,
        default_auto_archive_duration: options?.defaultAutoArchiveDuration,
        default_reaction_emoji: options?.defaultReactionEmoji,
        available_tags: options?.availableTags,
        default_sort_order: options?.defaultSortOrder
      });

      return channel;
    };

    this.delete = async function (guildID, channelID) {
      if (typeof guildID !== "string") throw new TypeError("GuildID Must be a STRING!");
      if (typeof channelID !== "string") throw new TypeError("ChannelID Must be a STRING!");

      const channel = await Manager.DELETE(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guildID}/channels/${channelID}`);

      return channel;
    };

    this.edit = async function (channelID, options = {
      name: "modified-channel",
      type: 0,
      topic: null,
      bitrate: 8000,
      userLimit: 0,
      rateLimit: 0,
      position: 0,
      permissions: [],
      parent: null,
      nsfw: false,
      rtcRegion: null,
      videoQualityMode: 0,
      defaultAutoArchiveDuration: 0,
      defaultReactionEmoji: null,
      availableTags: [],
      defaultSortOrder: 0
    }) {
      if (typeof channelID !== "string") throw new TypeError("ChannelID Must be a STRING!");
      const getChannel = await this.get(channelID);
      const guild = await GuildManager.get(getChannel.guild_id);

      const channel = await Manager.PATCH(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/channels/${channelID}`, {
        name: options?.name,
        type: options?.type,
        topic: options?.topic,
        bitrate: options?.bitrate,
        user_limit: options?.userLimit,
        rate_limit_per_user: options?.rateLimit,
        position: options?.position,
        permission_overwrites: options?.permissions,
        parent_id: options?.parent,
        nsfw: options?.nsfw,
        rtc_region: options?.rtcRegion,
        video_quality_mode: options?.videoQualityMode,
        default_auto_archive_duration: options?.defaultAutoArchiveDuration,
        default_reaction_emoji: options?.defaultReactionEmoji,
        available_tags: options?.availableTags,
        default_sort_order: options?.defaultSortOrder
      });

      return channel;
    };

    this.cache = ChannelCache;

    this.handleCache = async function (client_, debug) {
      await Promise.all(client_.channels.cache.map((channel) => {
        if (debug) console.log(chalk.grey(`[ChannelCacheManager] ${channel.name} (${channel.id}) was handled and cached.`));
        return this.cache.set(channel.id, channel);
      }));
    };
  };
};