import { Client as BaseClient, IntentsBitField as Intents, Partials } from "discord.js";

import { Loader } from "./Loader/Loader.js";
import { REST } from "./REST.js";

import express from "express";

import logs from "discord-logs";

import Data from "../../config/Data.js";

const intents = Object.values(Intents.Flags).filter((intent) => typeof intent === "string");
const partials = Object.values(Partials).filter((partial) => typeof partial === "string");

export class Client extends BaseClient {
  constructor() {
    super({ intents, partials });

    this.setMaxListeners(0);

    global.client = this;

    logs(this);

    this.#connect().then((client) => this.#uptime(client));
  };
  
  TOKEN = Data.Bot.TOKEN;

  REST = new REST(this);
  #LOADER = new Loader(this);

  async #connect() {
    // this.#LOADER.on("error", ({ type, error, body }) => console.log(`[Loader] An error ocurred! In ${type}, ${error}`));

    this.#LOADER.once("ready", async () => {
      const storage = this.#LOADER.storage;

      // await this.REST.PUT();
      await this.REST.PUT(storage);
    });

    this.#LOADER.Setup();

    return this;
  };

  #uptime(client = this, port = Math.floor(Math.random() * 9000)) {
    let connected = false;

    setInterval(() => {
      if (client.isReady()) {
        if (connected) return;

        connected = true;

        const app = express();

        app.get("/", (request, response) => {
          response.statusCode = 200;

          response.send(`
            <title>${client.user.username}'s Home</title>
            <h1 style="color: blue;">
            <button onclick="location.href='${client.generateInvite({ scopes: [ "bot", "applications.commands" ], permissions: [ "Administrator" ] })}'">Invite Bot</button>
            <br><br>
            <button onclick="location.href='https://discord.gg/HUuXnVAjbX'">Support Server</button>
            <br>
            <i>${client.user.tag}</i> is a multi-purpose discord bot for <a href="https://discord.gg/ZwhgJvXqm9">SkyLegend</a>. Coded with <a href="https://www.javascript.com/">JavaScript (ESM)</a>. And we used <a href="https://nodejs.org/en/about/">NodeJS (${process.version})</a> runtime.
            </h1>`)
        });

        app.listen(port, () => console.log(port));
      } else if (!connected) process.exit(1);
    }, 5000);
  };
};