import { PermissionsBitField } from "discord.js";
const PermissionManager = new PermissionsBitField();

import { UserManager as BaseUserManager } from "../../api/export.js";
const UserManager = new BaseUserManager();

import { GuildManager as BaseGuildManager } from "../../api/export.js";
const GuildManager = new BaseGuildManager();

import { ChannelManager as BaseChannelManager } from "../../api/export.js";
const ChannelManager = new BaseChannelManager();

import { Data } from "../../config/export.js";

export class Checker {
  constructor() {
    this.isUser = function (userID = null) {
      let state = false;

      (async () => {
        await UserManager.get(userID).then((user) => {
          if (user?.id) state = true;
        });
      })();

      return state;
    };

    this.isBot = function (userID = null) {
      let state = false;

      if (!this.isUser(userID)) return;

      (async () => {
        await UserManager.get(userID).then((user) => {
          if (user?.bot) state = true;
        });
      })();

      return state;
    };

    this.isGuild = function (guildID = null) {
      let state = false;

      (async () => {
        await GuildManager.get(guildID).then((guild) => {
          if (guild?.id) state = true;
        });
      })();

      return state;
    };

    this.isOwner = function (userID = null) {
      let state = false;

      if (!this.isUser(userID)) return;

      if (Data.Bot.Developers.includes(userID)) state = true;

      return state;
    };

    this.isPermission = function (permData = "ManageMessages") {
      let state = false;

      if (PermissionManager.has(permData)) state = true;

      return state;
    };

    this.isChannel = function (channelID = null) {
      let state = false;

      (async () => {
        await ChannelManager.get(channelID).then((channel) => {
          if (channel?.id) state = true;
        });
      })();

      return state;
    };
  };
};