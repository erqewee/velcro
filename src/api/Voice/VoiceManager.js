import { API } from "../API.js";
const api = new API();

import { joinVoiceChannel, getVoiceConnection, VoiceConnection } from "@discordjs/voice";

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import Discord, { Client } from "discord.js";
const { GuildChannel, Guild } = Discord;

export class VoiceManager {
  constructor(client) {
    this.client = client;
  };

  /**
   * The bot joins the channel you specify.
   * @param {GuildChannel} channel 
   * @returns {VoiceConnection}
   */
  create(channel) {
    const channelChecker = new api.checker.BaseChecker(channel);
    channelChecker.createError(!channelChecker.isObject, "channel", { expected: "Object", received: channelChecker }).throw();

    const voiceChannel = client.channels.resolve(channel.id);
    const connect = joinVoiceChannel({ channelId: voiceChannel.id, guildId: voiceChannel.guild.id, adapterCreator: voiceChannel.guild.voiceAdapterCreator });

    return connect;
  };

  /**
   * It checks if the bot is on the voice channel on the server you specify.
   * @param {Guild} guild
   * @returns {VoiceConnection | undefined}
   */
  async get(guild) {
    const guildChecker = new api.checker.BaseChecker(guild);
    guildChecker.createError(!guildChecker.isObject, "guild", { expected: "Object", received: guildChecker }).throw();

    const connectionGuild = await GuildManager.get(guild);
    const connection = getVoiceConnection(connectionGuild.id);

    return connection;
  };
};