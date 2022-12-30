import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import { ChannelManager as BaseChannelManager } from "../Channel/ChannelManager.js";
const ChannelManager = new BaseChannelManager();

import { InviteCache } from "./InviteCache.js";

import ora from "ora";

export class InviteManager {
  constructor(client) {
    this.client = client;
  };

  cache = InviteCache;

  async handleCache(debug = false) {
    if (!api.checker.check(debug).isBoolean()) api.checker.error("debug", "InvalidType", { expected: "Boolean", received: (typeof debug) });

    let spinner = ora("[CacheManager(Invite)] Initiating caching.");

    if (debug) spinner.start();

    await Promise.all(this.client.guilds.cache.map(async (guild) => {
      await Promise.all(guild.invites.cache.map((invite) => {
        const { code, guild } = invite;

        if (debug) {
          spinner.text = `[CacheManager(Invite)] ${code} (${guild.name} | ${guild.id}) was handled and cached.`;

          spinner = spinner.render().start("[CacheManager(Invite)] Invites are caching.");
        };

        return this.cache.set(id, invite);
      }));
    })).then(() => debug ? spinner.succeed("[CacheManager(Invite)] Caching completed!") : null).catch((err) => debug ? spinner.fail(`[CacheManager(Invite)] An error occurred while caching. | ${err}`) : null);

    return debug;
  };

  get(guildID, inviteCode) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
    if (!api.checker.check(inviteCode).isString()) api.checker.error("inviteCode", "InvalidType", { expected: "String", received: (typeof inviteCode) });

    const guild = GuildManager.get(guildID);
    const invite = GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/invites/${inviteCode}`);

    return invite;
  };

  create(channelID, options = {
    maxAge: 86400,
    maxUses: 0,
    temporary: false,
    unique: false,
    targetType: null,
    targetUserId: null,
    targetApplicationId: null
  }) {
    if (!api.checker.check(channelID).isString()) api.checker.error("channelId", "InvalidType", { expected: "String", received: (typeof channelID) });
    if (!api.checker.check(options).isObject()) api.checker.error("options", "InvalidType", { expected: "Object", received: (typeof options) });

    const channel = ChannelManager.get(channelID);

    const invite = POST(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/channels/${channel.id}/invites`, {
      json: {
        max_age: options?.maxAge,
        max_uses: options?.maxUses,
        temporary: options?.temporary,
        unique: options?.unique,
        target_type: options?.targetType,
        target_user_id: options?.targetUserId,
        target_application_id: options?.targetApplicationId
      }
    });

    return invite;
  };

  delete(channelID, inviteCode) {
    if (!api.checker.check(channelID).isString()) api.checker.error("channelId", "InvalidType", { expected: "String", received: (typeof channelID) });
    if (!api.checker.check(inviteCode).isString()) api.checker.error("inviteCode", "InvalidType", { expected: "String", received: (typeof inviteCode) });

    const channel = ChannelManager.get(channelID);
    const invite = DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channel.id}/invites/${inviteCode}`);

    return invite;
  };

  map(guildID, storage) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
    if (!api.checker.check(storage).isArray()) storage = [];

    const guild = GuildManager.get(guildID);

    const invites = GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/invites`);

    invites.map((invite) => storage.push(invite.code));

    return { storage, invites };
  };
};