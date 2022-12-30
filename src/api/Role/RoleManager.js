import { GuildManager as BaseGuildManager } from "../Guild/GuildManager.js";
const GuildManager = new BaseGuildManager();

export class RoleManager {
  constructor(client) {
    this.client = client;
  };

  get(guildID, roleID) {
    if (!api.checker.check(guildID).isString()) api.checker.error("guildId", "InvalidType", { expected: "String", received: (typeof guildID) });
    if (!api.checker.check(guildID).isString()) api.checker.error("roleId", "InvalidType", { expected: "String", received: (typeof roleID) });

    const guild = GuildManager.get(guildID);
    const role = client.guilds.resolve(guild.id).roles.resolve(roleID);

    return role;
  };
};