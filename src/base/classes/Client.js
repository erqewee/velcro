import { Client as BaseClient, IntentsBitField as Intents, Partials } from "discord.js";

import express from "express";

import { Loader } from "./Loader/Loader.js";
import { REST } from "./REST.js";

import { Structure } from "../structures/export.js";
const databases = new Structure().databases;

const app = express();

export class Client extends BaseClient {
  constructor() {
    super({
      failIfNotExists: true,

      intents: Object.values(Intents.Flags).filter((intent) => typeof intent === "string"),
      partials: Object.values(Partials).filter((partial) => typeof partial === "string"),

      allowedMentions: {
        parse: ["users"],
        repliedUser: false
      },

      rest: {
        timeout: 30000,
        version: "10"
      },

      ws: {
        compress: false,
        large_threshold: 250,
        version: 10
      }
    });

    this.REST = new REST(this);
    this.loader = new Loader(this, [databases.economy, databases.general, databases.subscribe]);

    this.setMaxListeners(0);

    global.client = this;
  };

  connect() {
    const rest = this.REST;
    const loader = this.loader;

    loader.on("error", ({ type, error, body }) => console.log(`[Loader] An error ocurred! In ${type}, ${error}`));

    loader.once("handlersReady", (message) => console.log(message));
    loader.once("commandsReady", (message) => console.log(message));
    loader.once("eventsReady", (message) => console.log(message));

    loader.once("ready", async (message, storage) => {
      await rest.put([]);
      await rest.put(storage);

      return console.log(message);
    });

    loader.Setup();

    const client = this;

    function uptime(port = 80) {
      const { port } = uptimeOptions;

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