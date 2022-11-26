import { Manager } from "../Manager.js";

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import { ChannelManager as BaseChannelManager } from "../Channel/ChannelManager.js";
const ChannelManager = new BaseChannelManager();

import { InviteCache } from "./InviteCache.js";

import chalk from "chalk";

export class InviteManager {
  constructor() {
    this.get = async function (guildID, inviteCode) {
      if (typeof guildID !== "string") throw new TypeError("GuildID Must be a STRING!");
      if (typeof inviteCode !== "string") throw new TypeError("InviteCode Must be a STRING!");

      const guild = await GuildManager.get(guildID);
      const invite = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/invites/${inviteCode}`);

      return invite;
    };

    this.create = async function (channelID, options = {
      maxAge: 86400,
      maxUses: 0,
      temporary: false,
      unique: false,
      targetType: null,
      targetUserId: null,
      targetApplicationId: null
    }) {
      if (typeof channelID !== "string") throw new TypeError("channelID Must be a STRING!");

      const channel = await ChannelManager.get(channelID);

      const invite = await Manager.POST(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/channels/${channel.id}/invites`, {
        max_age: options?.maxAge,
        max_uses: options?.maxUses,
        temporary: options?.temporary,
        unique: options?.unique,
        target_type: options?.targetType,
        target_user_id: options?.targetUserId,
        target_application_id: options?.targetApplicationId
      });

      return invite;
    };

    this.delete = async function (channelID, inviteCode) {
      if (typeof channelID !== "string") throw new TypeError("ChannelID Must be a STRING!");
      if (typeof inviteCode !== "string") throw new TypeError("InviteCode Must be a STRING!");

      const channel = await ChannelManager.get(channelID);
      const invite = await Manager.DELETE(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/channels/${channel.id}/invites/${inviteCode}`);

      return invite;
    };

    this.map = async function (guildID, storage) {
      if (!storage) storage = [];
      const storageFull = [];

      if (typeof guildID !== "string") throw new TypeError("GuildID Must be a STRING!");
      if (!Array.isArray(storage)) throw new TypeError("Storage must be a ARRAY!");

      const guild = await GuildManager.get(guildID);

      const invites = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/guilds/${guild.id}/invites`);

      await invites.map((invite) => storage.push(invite.code));

      return {
        storage: storage,
        invites: invites
      };
    };

    this.cache = InviteCache;

    this.handleCache = async function (client_, debug) {
      await Promise.all(client_.guilds.cache.map(async (guild) => {
        const invite = (await this.map(guild.id)).invites;
        if (!invite) return;

        // if (debug) console.log(chalk.grey(`[InviteCacheManager] ${invite.guild.name} (${invite.code}) was handled and cached.`));

        return this.cache.set(invite.code, invite);
      }));
    };
  };
};