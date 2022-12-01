import { Client as BaseClient, IntentsBitField as Intents, Partials } from "discord.js";

import express from "express";

import { Loader } from "./Loader/Loader.js";
import { REST } from "./REST.js";

import { Manager } from "../structures/Manager.js";
const databases = new Manager().databases;

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

    const rest = new REST(this);
    this.REST = rest;

    const loader = new Loader(this, [databases.economy, databases.general, databases.subscribe]);
    this.loader = loader;

    this.setMaxListeners(100);

    this.connect = async function (uptimeMode) {
      if (uptimeMode && typeof uptimeMode !== "boolean") uptimeMode = false;
      
      loader.on("handlersReady", (message) => console.log(message));
      loader.on("commandsReady", (message) => console.log(message));
      loader.on("eventsReady", (message) => console.log(message));
      loader.on("error", ({ type, error, body }) => console.log(`[Loader - ${type}] An error ocurred! (${body?.file}) ${error}`));
      loader.on("ready", (message, storage) => {
        rest.put(storage);

        console.log(message);

        if (uptimeMode) {
          app.get("/", (request, response) => {
            response.send(`
            <title>${this.user.username}'s Home</title>
            <h1 style="color: blue;">
            <button onlick="location.href='${this.generateInvite({ scopes: ["bot", "applications.commands"], permissions: ["Administrator"] })}'">Invite Bot</button>
            <br><br>
            <button onclick="location.href='https://discord.gg/HUuXnVAjbX'">Support Server</button>
            <br>
            <i>${this.user.tag}</i> is a multi-purpose discord bot for <a href="https://discord.gg/ZwhgJvXqm9">SkyLegend</a>. Coded with <a href="https://www.javascript.com/">JavaScript (ESM)</a>. And we used <a href="https://nodejs.org/en/about/">NodeJS (${process.version})</a> runtime.
            </h1>`)
          });

          app.listen(80, () => { });
        };
      });

      return this.loader.Setup();
    };

    global.client = this;
  };
};