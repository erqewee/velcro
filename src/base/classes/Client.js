import { Client as BaseClient, IntentsBitField as Intents, Partials } from "discord.js";

import express from "express";

import { Loader } from "./Loader/Loader.js";
import { REST } from "./REST.js";

import logs from "discord-logs";

export class Client extends BaseClient {
  constructor() {
    super({
      failIfNotExists: false,

      intents: Object.values(Intents.Flags).filter((intent) => typeof intent === "string"),
      partials: Object.values(Partials).filter((partial) => typeof partial === "string"),

      ws: {
        compress: false,
        large_threshold: 250,
        version: 10
      }
    });

    this.setMaxListeners(0);

    global.client = this;

    logs(this);

    this.#connect().then(() => this.#uptime());
  };

  #REST = new REST(this);
  #LOADER = new Loader(this);

  async #connect() {
    // this.#LOADER.on("error", ({ type, error, body }) => console.log(`[Loader] An error ocurred! In ${type}, ${error}`));

    this.#LOADER.once("ready", async () => {
      const storage = this.#LOADER.storage;

      // await this.#REST.PUT([]);
      // await this.#REST.PUT(storage);
    });

    return this.#LOADER.Setup();
  };

  #uptime(port = Math.floor(Math.random() * 9000)) {
    const app = express();

    app.get("/", (request, response) => {
      response.statusCode = 200;

      response.send(`
        <title>${this.user.username}'s Home</title>
        <h1 style="color: blue;">
        <button onclick="location.href='${this.generateInvite({ scopes: ["bot", "applications.commands"], permissions: ["Administrator"] })}'">Invite Bot</button>
        <br><br>
        <button onclick="location.href='https://discord.gg/HUuXnVAjbX'">Support Server</button>
        <br>
        <i>${this.user.tag}</i> is a multi-purpose discord bot for <a href="https://discord.gg/ZwhgJvXqm9">SkyLegend</a>. Coded with <a href="https://www.javascript.com/">JavaScript (ESM)</a>. And we used <a href="https://nodejs.org/en/about/">NodeJS (${process.version})</a> runtime.
        </h1>`)
    });

    app.listen(port);
  };
};