import { Manager } from "../Manager.js";

import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

export class RoleManager {
  constructor(client) {
    this.get = async function (guildID, roleID) {
      if (typeof guildID !== "string") throw new TypeError("GuildID Must be a STRING!");
      if (typeof roleID !== "string") throw new TypeError("RoleID Must be a STRING!");

      const guild = await GuildManager.get(guildID);
      const role = await (await client.guilds.resolve(guild.id)).roles.resolve(roleID);

      return role;
    };
  };
};