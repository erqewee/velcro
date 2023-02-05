import { API } from "../API.js";
const api = new API();

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

import Discord, { Client } from "discord.js";
const { Role } = Discord;

export class RoleManager {
  constructor(client) {
    this.client = client;
  };

  /**
   * Retrieves the data of the specified role from the specified server.
   * @param {string} guildID
   * @param {string} roleID
   * @returns {Promise<Role>}
   */
  async get(guildID, roleID) {
    const guildError = new api.checker.BaseChecker(guildID).Error;
    guildError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'guildId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const roleError = new api.checker.BaseChecker(roleID).Error;
    roleError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'roleId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const guild = await GuildManager.get(client.guilds.resolve(guildID));
    const role = client.guilds.resolve(guild.id).roles.resolve(roleID);

    return role;
  };
};