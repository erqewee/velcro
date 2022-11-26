import { joinVoiceChannel, getVoiceConnection } from "@discordjs/voice";

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

export class VoiceManager {
  constructor(client) {
    this.create = async function (channelID) {
      if (typeof channelID !== "string") throw new TypeError("ChannelID must be a STRING!");

      const channel = await client.channels.resolve(channelID);
      const connect = joinVoiceChannel({ channelId: channel.id, guildId: channel.guild.id, adapterCreator: channel.guild.voiceAdapterCreator });

      return connect;
    };

    this.get = async function (guildID) {
      if (typeof guildID !== "string") throw new TypeError("GuildID must be a STRING!");

      const guild = await GuildManager.get(guildID);
      const connection = getVoiceConnection(guild.id);

      return connection;
    };
  };
};