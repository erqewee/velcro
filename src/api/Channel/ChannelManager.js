import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import { ChannelsCache as ChannelCache } from "../Caches.js";

import ora from "ora";

import Discord, { Client } from "discord.js";
const { Channel } = Discord;

export class ChannelManager {
  constructor(client) {
    this.client = client;
  };

  /**
   * Cache for channels.
   */
  cache = ChannelCache;

  /**
   * It saves channels in the cache.
   * @param {boolean} debug 
   * @returns {boolean}
   */
  async handleCache(debug = false) {
    const debugChecker = new api.checker.BaseChecker(debug);
    debugChecker.createError(!debugChecker.isBoolean, "debug", { expected: "Boolean", received: debugChecker }).throw();

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

  /**
   * Get the channel whose ID you specified.
   * @param {string} channelID 
   * @returns {Promise<Channel>}
   */
  async get(channelID) {
    const channelChecker = new api.checker.BaseChecker(channelID);
    channelChecker.createError(!channelChecker.isString, "channelId", { expected: "String", received: channelChecker });

    const channelBase = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channelID}`);
    const channel = client.channels.resolve(channelBase.id);

    return channel;
  };

  /**
   * Get all the channels of the bot.
   * @returns {Promise<Channel[]>}
   */
  async map() {
    const channels = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/channels`);

    const channelsArray = [];

    for (let index = 0; index < channels.length; index++) channelsArray.push(client.channels.resolve(channels[index].id));

    return channelsArray;
  };

  /**
   * Creates a new Discord Guild Channel.
   * @param {string} guildID 
   * @param {object} options 
   * @returns {Promise<Channel>}
   */
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
    const guildChecker = new api.checker.BaseChecker(guildID);
    guildChecker.createError(!guildChecker.isString, "guildId", { expected: "String", received: guildChecker });

    const createdChannel = await POST(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guildID}/channels`, {
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

    const channel = client.channels.resolve(createdChannel.id);

    return channel;
  };

  /**
   * Deletes a Discord Guild Channel.
   * @param {string} guildID 
   * @param {string} channelID 
   * @returns {void}
   */
  delete(guildID, channelID) {
    const guildChecker = new api.checker.BaseChecker(guildID);
    guildChecker.createError(!guildChecker.isString, "guildId", { expected: "String", received: guildChecker }); 
    
    const channelChecker = new api.checker.BaseChecker(channelID);
    channelChecker.createError(!channelChecker.isString, "channelId", { expected: "String", received: channelChecker });

    DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guildID}/channels/${channelID}`);

    return void 0;
  };

  /**
   * Edits a Discord Guild Channel. 
   * @param {string} channelID 
   * @param {object} options 
   * @returns {Promise<Channel>}
   */
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
    const channelChecker = new api.checker.BaseChecker(channelID);
    channelChecker.createError(!channelChecker.isString, "channelId", { expected: "String", received: channelChecker });

    const getChannel = await this.get(channelID);
    const guild = await GuildManager.get(client.guilds.resolve(getChannel.guild_id).id);

    const editedChannel = await PATCH(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/channels/${channelID}`, {
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

    const channel = client.channels.resolve(editedChannel.id);
    
    return channel;
  };
};