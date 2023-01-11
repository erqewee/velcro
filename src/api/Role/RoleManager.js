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
    const guildChecker = new api.checker.BaseChecker(guildID);
    guildChecker.createError(!guildChecker.isString, "guildId", { expected: "String", received: guildChecker }).throw();    

    const roleChecker = new api.checker.BaseChecker(roleID);
    roleChecker.createError(!roleChecker.isString, "roleId", { expected: "String", received: roleChecker }).throw();

    const guild = await GuildManager.get(guildID);
    const role = client.guilds.resolve(guild.id).roles.resolve(roleID);

    return role;
  };
};