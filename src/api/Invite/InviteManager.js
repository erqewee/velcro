import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import { ChannelManager as BaseChannelManager } from "../Channel/ChannelManager.js";
const ChannelManager = new BaseChannelManager();

import { InvitesCache as InviteCache } from "../Caches.js";

import ora from "ora";

import Discord, { Client } from "discord.js";
const { Invite } = Discord;

export class InviteManager {
  constructor(client) {
    this.client = client;
  };

  /**
   * Cache for guild invites.
   */
  cache = InviteCache;

  /**
   * It saves guild invites in the cache.
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

    let spinner = ora("[CacheManager(Invite)] Initiating caching.");

    if (debug) spinner.start();

    await Promise.all(client.guilds.cache.map(async (guild) => {
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

  /**
   * It assigns the data of the invitation with the specified code from the server with the specified ID.
   * @param {string} guildID 
   * @param {string} inviteCode 
   * @returns {Promise<Invite>}
   */
  async get(guildID, inviteCode) {
    const guildError = new api.checker.BaseChecker(guildID).Error;
    guildError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'guildId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const inviteError = new api.checker.BaseChecker(inviteCode).Error;
    inviteError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'inviteCode'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const guild = await GuildManager.get(guildID);
    const invite = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/invites/${inviteCode}`);

    const inviteData = client.guilds.resolve(guild.id).invites.resolve(invite.code);

    return inviteData;
  };

  /**
   * Creates a new invitation on the channel with the specified ID.
   * @param {string} channelID 
   * @param {object} options 
   * @returns {Promise<Invite>}
   */
  async create(channelID, options = {
    maxAge: 86400,
    maxUses: 0,
    temporary: false,
    unique: false,
    targetType: null,
    targetUserId: null,
    targetApplicationId: null
  }) {
    const channelError = new api.checker.BaseChecker(channelID).Error;
    channelError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'channelId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const channel = await ChannelManager.get(channelID);

    const createdInvite = await POST(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/channels/${channel.id}/invites`, {
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

    const invite = client.channels.resolve(channel.id).guild.invites.resolve(createdInvite.code);

    return invite;
  };

  /**
   * Deletes a Discord Guild Invite.
   * @param {string} channelID 
   * @param {string} inviteCode 
   * @returns {number}
   */
  async delete(channelID, inviteCode) {
    const channelError = new api.checker.BaseChecker(channelID).Error;
    channelError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'channelId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const inviteError = new api.checker.BaseChecker(inviteCode).Error;
    inviteError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'inviteCode'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const channel = await ChannelManager.get(channelID);
    DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channel.id}/invites/${inviteCode}`);

    return 0;
  };

  /**
   * Receives all invitations from the server whose ID is specified.
   * @param {string} guildID 
   * @param {Invite[]} storage 
   * @returns {Promise<Invite[]>}
   */
  async map(guildID, storage = []) {
    const guildError = new api.checker.BaseChecker(guildID).Error;
    guildError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'guildId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const storageError = new api.checker.BaseChecker(storage).Error;
    storageError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'storage'.")
      .setCondition("isNotArray")
      .setType("InvalidType")
      .throw();

    const guild = await GuildManager.get(client.guilds.resolve(guildID));

    const invites = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/guilds/${guild.id}/invites`);

    const invitesArray = storage ? storage : [];

    if (invites.length > 0) for (let index = 0; index < invites.length; index++) invitesArray.push(invites[ index ]);

    return invitesArray;
  };
};