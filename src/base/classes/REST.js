import { REST as Rest, Routes } from "discord.js";

import { Data } from "../../config/export.js";

export class REST {
  constructor(client) {
    const rest = new Rest({ version: "10" }).setToken(Data.Bot.TOKEN);

    this.routes = Routes;
    
    this.put = function (body) {
      if (!Array.isArray(body)) throw new TypeError("BODY only got ARRAY!");

      return rest.put(this.routes.applicationGuildCommands(client.user?.id, "942839259876958268"), { body });
    };
  };
};