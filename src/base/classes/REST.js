import { REST as Rest, Routes } from "discord.js";

import { Data } from "../../config/export.js";

export class REST {
  constructor(client) {
    this.client = client;
  };

  #routes = Routes;
  #rest = new Rest().setToken(Data.Bot.TOKEN);

  async PUT(body = []) {
    let completed = false;

    await this.#rest.put(this.#routes.applicationGuildCommands(this.client.user?.id, "942839259876958268"), { body }).then(() => completed = true);

    return completed;
  };
};