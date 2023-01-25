import { REST as Rest, Routes } from "discord.js";

export class REST {
  constructor(client) {
    this.client = client;

    this.rest = new Rest();

    this.rest.setToken(this.client.TOKEN)
  };

  #routes = Routes;

  async PUT(body = []) {
    let completed = false;

    await this.rest.put(this.#routes.applicationCommands(this.client.user?.id), { body });

    completed = true;
    
    return completed;
  };
};