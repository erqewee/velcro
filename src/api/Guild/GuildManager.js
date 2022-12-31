import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { GuildsCache as GuildCache } from "../Caches.js";

import ora from "ora";

export class GuildManager {
  constructor(client) {
    this.client = client;
  };

  cache = GuildCache;

  async handleCache(debug = false) {
    if (!api.checker.check(debug).isBoolean()) api.checker.error("debug", "InvalidType", { expected: "Boolean", received: (typeof debug) });

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

  async get(guildID) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "Boolean", received: (typeof guildID) });

    const guild = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guildID}`);

    return guild;
  };

  async map() {
    const guilds = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds`);

    return guilds;
  };

  leave(guildID) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "Boolean", received: (typeof guildID) });

    const guild = DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guildID}`);

    return guild;
  };

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
    if (!api.checker.check(options).isObject()) api.checker.error("options", "InvalidType", { expected: "Object", received: (typeof options) });

    const guild = await POST(`${api.config.BASE_URL}/${api.config.VERSION}/guilds`, {
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

    return guild;
  };

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
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "Boolean", received: (typeof guildID) });
    if (!api.checker.check(options).isObject()) api.checker.error("options", "InvalidType", { expected: "Object", received: (typeof options) });

    const guild = await PATCH(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guildID}`, {
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

    return guild;
  };
};