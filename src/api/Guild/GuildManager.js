import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { GuildsCache as GuildCache } from "../Caches.js";

import ora from "ora";

import Discord, { Client } from "discord.js";
const { Guild } = Discord;

export class GuildManager {
  constructor(client) {
    this.client = client;
  };

  /**
   * Cache for guilds.
   */
  cache = GuildCache;

  /**
   * It saves guilds in the cache.
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

    let spinner = ora("[CacheManager(Guild)] Initiating caching.");

    if (debug) spinner.start();

    await Promise.all(this.client.guilds.cache.map(async (guild) => {
      const { id, name } = guild;

      if (debug) {
        spinner.text = `[CacheManager(Guild)] ${name} (${id}) was handled and cached.`;

        spinner = spinner.render().start();
      };

      return this.cache.set(id, guild);
    })).then(() => debug ? spinner.succeed("[CacheManager(Guild)] Caching completed!") : null).catch((err) => debug ? spinner.fail(`[CacheManager(Guild)] An error occurred while caching. | ${err}`) : null);

    return debug;
  };

  /**
   * Discards the data of the specified server.
   * @param {object} guild 
   * @returns {Promise<Guild>} 
   */
  async get(guild) {
    const guildError = new api.checker.BaseChecker(guild).Error;
    guildError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'guild'.")
      .setCondition("isNotObject")
      .setType("InvalidType")
      .throw();

    const fetched = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}`);
    const resolved = client.guilds.resolve(fetched.id);

    return resolved;
  };

  /**
   * Get all the guilds of the bot.
   * @returns {Promise<Guild[]>}
   */
  async map() {
    const guilds = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds`);

    const guildsArray = [];

    if (guilds.length > 0) for (let index = 0; index < guilds.length; index++) guildsArray.push(client.guilds.resolve(guilds[index].id));

    return guildsArray;
  };

  /**
   * Deletes the server with the specified ID.
   * @param {string} guildID 
   * @returns {void}
   */
  leave(guildID) {
    const guildError = new api.checker.BaseChecker(guildID).Error;
    guildError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'guildId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guildID}`);

    return void 0;
  };

  /**
   * Creates a new Discord Guild.
   * @param {object} options 
   * @returns {Promise<Guild>}
   */
  async create(options = {
    name: "New Guild",
    region: null,
    icon: null,
    verificationLevel: 0,
    defaultMessageNotifications: 0,
    explicitContentFilter: 0,
    roles: [],
    channels: [],
    afkChannelId: null,
    afkTimeout: 0,
    systemChannelId: null,
    systemChannelFlags: 0
  }) {
    const createdGuild = await POST(`${api.config.BASE_URL}/${api.config.VERSION}/guilds`, {
      json: {
        name: options?.name,
        region: options?.region,
        icon: options?.icon,
        verification_level: options?.verificationLevel,
        default_message_notifications: options?.defaultMessageNotifications,
        explicit_content_filter: options?.explicitContentFilter,
        roles: options?.roles,
        channels: options?.channels,
        afk_channel_id: options?.afkChannelId,
        afk_timeout: options?.afkTimeout,
        system_channel_id: options?.systemChannelId,
        system_channel_flags: options?.systemChannelFlags
      }
    });

    const guild = client.guilds.resolve(createdGuild.id);

    return guild;
  };

  /**
   * Edits a Discord Guild.
   * @param {string} guildID 
   * @param {object} options 
   * @returns {Promise<Guild>}
   */
  async edit(guildID, options = {
    name: "Modified Guild",
    region: null,
    verificationLevel: 0,
    defaultMessageNotifications: 0,
    explicitContentFilter: 0,
    afkChannelId: null,
    afkTimeout: 0,
    icon: null,
    ownerId: null,
    splash: null,
    discoverySplash: null,
    banner: null,
    systemChannelId: null,
    systemChannelFlags: 0,
    rulesChannelId: 0,
    publicUpdatesChannelId: null,
    preferredLocale: null,
    features: [],
    description: null,
    premiumProgressBarEnabled: false
  }) {
    const guildError = new api.checker.BaseChecker(guildID).Error;
    guildError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'guildId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const editedGuild = await PATCH(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guildID}`, {
      json: {
        name: options?.name,
        region: options?.region,
        verification_level: options?.verificationLevel,
        default_message_notifications: options?.defaultMessageNotifications,
        explicit_content_filter: options?.explicitContentFilter,
        afk_channel_id: options?.afkChannelId,
        afk_timeout: options?.afkTimeout,
        icon: options?.icon,
        owner_id: options?.ownerId,
        splash: options?.splash,
        discovery_splash: options?.discoverySplash,
        banner: options?.banner,
        system_channel_id: options?.systemChannelId,
        system_channel_flags: options?.systemChannelFlags,
        rules_channel_id: options?.rulesChannelId,
        public_updates_channel_id: options?.publicUpdatesChannelId,
        preferred_locale: options?.preferredLocale,
        features: options?.features,
        description: options?.description,
        premium_progress_bar_enabled: options?.premiumProgressBarEnabled
      }
    });

    const guild = client.guilds.resolve(editedGuild.id);
    
    return guild;
  };
};