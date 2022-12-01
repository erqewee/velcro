import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { GuildCache } from "./GuildCache.js";

import chalk from "chalk";

export class GuildManager {
  constructor() {
    this.get = async function (guildID) {
      if (typeof guildID !== "string") throw new TypeError("GuildID Must be a STRING!");

      const guild = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guildID}`);

      return guild;
    };

    this.map = async function () {
      if (!Array.isArray(storage)) throw new TypeError("Storage Must be a ARRAY!");

      const guilds = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds`);

      return guilds;
    };

    this.leave = async function (guildID) {
      if (typeof guildID !== "string") throw new TypeError("GuildID Must be a STRING!");

      const guild = await DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guildID}`);

      return guild;
    };

    this.create = async function (options = {
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

    this.edit = async function (guildID, options = {
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
      if (typeof guildID !== "string") throw new TypeError("GuildID Must be a STRING!");

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

    this.cache = GuildCache;

    this.handleCache = async function (client_, debug) {
      return client_.guilds.cache.map(async (guild) => {
        if (debug) console.log(chalk.grey(`[GuildCacheManager] ${guild.name} (${guild.id}) was handled and cached.`));

        return this.cache.set(guild.id, guild);
      });
    };
  };
};