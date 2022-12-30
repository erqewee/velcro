import { Client as BaseClient, IntentsBitField as Intents, Partials } from "discord.js";

import express from "express";

import { Loader } from "./Loader/Loader.js";
import { REST } from "./REST.js";

const app = express();

export class Client extends BaseClient {
  constructor() {
    super({
      failIfNotExists: false,

      intents: Object.values(Intents.Flags).filter((intent) => typeof intent === "string"),
      partials: Object.values(Partials).filter((partial) => typeof partial === "string"),

      allowedMentions: {
        parse: ["users"],
        repliedUser: false
      },

      ws: {
        compress: false,
        large_threshold: 250,
        version: 10
      }
    });

    this.setMaxListeners(0);

    global.client = this;

    this.#connect().uptime();
  };

  #REST = new REST(this);
  #LOADER = new Loader(this);

  #connect() {
    this.#LOADER.on("error", ({ type, error, body }) => console.log(`[Loader] An error ocurred! In ${type}, ${error}`));

    this.#LOADER.once("ready", async () => {
      const storage = this.#LOADER.storage;

      // await this.#REST.put([]);
      // await this.#REST.put(storage);
    });

    this.#LOADER.Setup();

    const client = this;

    function uptime(port = 80) {
      app.get("/", (request, response) => {
        response.statusCode = 200;

        response.send(`
          <title>${client.user.username}'s Home</title>
          <h1 style="color: blue;">
          <button onclick="location.href='${client.generateInvite({ scopes: ["bot", "applications.commands"], permissions: ["Administrator"] })}'">Invite Bot</button>
          <br><br>
          <button onclick="location.href='https://discord.gg/HUuXnVAjbX'">Support Server</button>
          <br>
          <i>${client.user.tag}</i> is a multi-purpose discord bot for <a href="https://discord.gg/ZwhgJvXqm9">SkyLegend</a>. Coded with <a href="https://www.javascript.com/">JavaScript (ESM)</a>. And we used <a href="https://nodejs.org/en/about/">NodeJS (${process.version})</a> runtime.
          </h1>`)
      });

      app.listen(port);
    };

    return { uptime };
  };
};