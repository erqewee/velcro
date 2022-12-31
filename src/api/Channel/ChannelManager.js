import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import { ChannelsCache as ChannelCache } from "../Caches.js";

import ora from "ora";

export class ChannelManager {
  constructor(client) {
    this.client = client;
  };

  cache = ChannelCache;

  async handleCache(debug = false) {
    if (!api.checker.check(debug).isBoolean()) api.checker.error("debug", "InvalidType", { expected: "Boolean", received: (typeof debug) });

    let spinner = ora("[CacheManager(Channel)] Initiating caching.");

    if (debug) spinner.start();

    await Promise.all(client.channels.cache.map((channel) => {
      const { name, id } = channel;

      if (debug) {
        spinner.text = `[CacheManager(Channel)] ${name} (${id}) was handled and cached.`;

        spinner = spinner.render().start();
      };

      return this.cache.set(id, channel);
    })).then(() => debug ? spinner.succeed("[CacheManager(Channel)] Caching completed!") : null).catch((err) => debug ? spinner.fail(`[CacheManager(Channel)] An error occurred while caching. | ${err}`) : null);

    return debug;
  };

  async get(channelID) {
    if (!api.checker.check(channelID).isString()) api.checker.error("channelId", "InvalidType", { expected: "String", received: (typeof channelID) });

    const channel = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channelID}`);

    return channel;
  };

  async map(callback) {
    if (!api.checker.check(callback).isFunction()) callback = function () { };

    const channels = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/channels`);

    return channels;
  };

  async create(guildID, options = {
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
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });

    const channel = await POST(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guildID}/channels`, {
      json: {
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
      }
    });

    return channel;
  };

  delete(guildID, channelID) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
    if (!api.checker.check(channelID).isString()) api.checker.error("channelId", "InvalidType", { expected: "String", received: (typeof channelID) });

    const channel = DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guildID}/channels/${channelID}`);

    return channel;
  };

  async edit(channelID, options = {
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
    if (!api.checker.check(channelID).isString()) api.checker.error("channelId", "InvalidType", { expected: "String", received: (typeof channelID) });

    const getChannel = await this.get(channelID);
    const guild = await GuildManager.get(getChannel.guild_id);

    const channel = await PATCH(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/channels/${channelID}`, {
      json: {
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
      }
    });

    return channel;
  };
};