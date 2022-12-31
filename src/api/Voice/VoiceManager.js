import { API } from "../API.js";
const api = new API();

import { joinVoiceChannel, getVoiceConnection } from "@discordjs/voice";

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

export class VoiceManager {
  constructor(client) {
    this.client = client;
  };

  create(channelID) {
    if (!api.checker.check(channelID).isString()) api.checker.error("channelId", "InvalidType", { expected: "String", received: (typeof channelID) });
    
    const channel = client.channels.resolve(channelID);
    const connect = joinVoiceChannel({ channelId: channel.id, guildId: channel.guild.id, adapterCreator: channel.guild.voiceAdapterCreator });

    return connect;
  };

  async get(guildID) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });

    const guild = await GuildManager.get(guildID);
    const connection = getVoiceConnection(guild.id);

    return connection;
  };
};