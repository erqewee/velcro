import { statSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

import { Events } from "discord.js";

import { CommandsCache, EventsCache, HandlersCache } from "./LoaderCache.js";
import { Structure } from "../../structures/export.js";

import { Data } from "../../../config/export.js";

import EventEmitter from "node:events";

import chalk from "chalk";
const dbs = new Structure().databases;

export class Loader extends EventEmitter {
  constructor(client = null, databases = [dbs.economy, dbs.general, dbs.subscribe]) {
    super();

    if (!client) throw new Error("Client isn't provided.");

    const storage = [];

    this.commands = { cache: CommandsCache };
    this.events = { types: Events, cache: EventsCache };
    this.handlers = { types: this.events.types, cache: HandlersCache };

    this.setMaxListeners(0);

    this.HandlerSetup = async function () {
      const path = this.resolve("./src/base/events/handlers");

      let body = null;

      const loadedHandlers = [];

      try {
        await Promise.all(this.read(path).filter((file) => this.isFile(path, "/../handlers", file) && file.endsWith(".js")).map(async (file) => {
          const handlerBase = new (await import(`../../events/handlers/${file}`)).default;

          if (handlerBase?.name && handlerBase?.enabled) {
            this.handlers.cache.set(handlerBase.name, handlerBase);

            const handler = this.handlers.cache.get(handlerBase.name);

            client.on(handler.name, async (...interactions) => {
              if (handler?.type === "UserMenu" && interactions.map((interaction) => interaction.customId && interaction.isUserSelectMenu())) return await handler.execute(...interactions);
              else if (handler?.type === "StringMenu" && interactions.map((interaction) => interaction.customId && interaction.isStringSelectMenu())) return await handler.execute(...interactions);
              else if (handler?.type === "Button" && interactions.map((interaction) => interaction.customId && interaction.isButton())) return await handler.execute(...interactions);
              else if (handler?.type === "Modal" && interactions.map((interaction) => interaction.customId && interaction.isModalSubmit())) return await handler.execute(...interactions);
              else if (handler?.type === "ChatCommand" && interactions.map((interaction) => !interaction.customId && interaction?.isChatInputCommand && interaction?.isChatInputCommand())) return await handler.execute(...interactions);
              else if (handler?.type === "ContextCommand" && interactions.map((interaction) => !interaction.customId && interaction?.isChatInputCommand && interaction?.isContextMenuCommand())) return await handler.execute(...interactions);
              else return await handler.execute(...interactions);
            });

            loadedHandlers.push(handler.name);

            body = {
              path: path,
              file: file,
              name: handler.name,
              type: handler?.type,
              size: (path.length + 1),
              loaded: ((loadedHandlers.length + 1) - 1)
            };

            this.emit("handlerLoaded", body);
          };
        }));

        this.emit("handlersReady", chalk.greenBright("[Loader] Handlers Ready."), loadedHandlers);
      } catch (err) {
        this.emit("error", {
          type: "HANDLER",
          error: err,
          body: body
        });
      };
    };

    this.EventSetup = async function () {
      const path = this.resolve("./src/base/events");

      const loadedEvents = [];

      let body = null;

      try {
        await Promise.all(this.read(path).filter((dir) => this.isFolder(path, dir)).map(async (dir) => {
          if (dir === "handlers") return;

          const events = this.read(`${path}/${dir}`);

          await Promise.all(events.filter((file) => this.isFile(path, dir, file) && file.endsWith(".js")).map(async (file) => {
            const eventBase = new (await import(`../../events/${dir}/${file}`)).default;

            if (eventBase?.name && eventBase?.enabled) {
              this.events.cache.set(eventBase.name, eventBase);

              const event = this.events.cache.get(eventBase.name);

              if (!event.once) client.on(event.name, async (...interactions) => {
                if (event?.type === "UserMenu" && interactions.map((interaction) => interaction.customId && interaction.isUserSelectMenu())) return await event.execute(...interactions);
                else if (event?.type === "StringMenu" && interactions.map((interaction) => interaction.customId && interaction.isStringSelectMenu())) return await event.execute(...interactions);
                else if (event?.type === "Button" && interactions.map((interaction) => interaction.customId && interaction.isButton())) return await event.execute(...interactions);
                else if (event?.type === "Modal" && interactions.map((interaction) => interaction.customId && interaction.isModalSubmit())) return await event.execute(...interactions);
                else if (event?.type === "ChatCommand" && interactions.map((interaction) => !interaction.customId && interaction?.isChatInputCommand && interaction?.isChatInputCommand())) return await event.execute(...interactions);
                else if (event?.type === "ContextCommand" && interactions.map((interaction) => !interaction.customId && interaction?.isChatInputCommand && interaction?.isContextMenuCommand())) return await event.execute(...interactions);
                else return await event.execute(...interactions);
              });
              if (event.once) client.once(event.name, async (...interactions) => await event.execute(...interactions));
              if (event.process) process.on(event.name, async (...args) => await event.execute(...args));
              if (event.database) databases.map((database) => database.on(event.name, async (...args) => await event.execute(...args)));

              loadedEvents.push(event.name);

              body = {
                path: path,
                dir: dir,
                file: file,
                name: event.name,
                type: event?.type,
                process: event.process,
                size: (events.length + 1),
                loaded: ((loadedEvents.length + 1) - 1),
                once: event.once
              };

              this.emit("eventLoaded", body);
            };
          }))
        }));

        this.emit("eventsReady", chalk.blueBright("[Loader] Events Ready."), loadedEvents);
      } catch (err) {
        this.emit("error", {
          type: "EVENT",
          error: err,
          body: body
        });
      };
    };

    this.CommandSetup = async function () {
      const path = this.resolve("./src/base/commands");

      const loadedCommands = [];

      let body = null;

      try {
        await Promise.all(this.read(path).filter((dir) => this.isFolder(path, dir)).map(async (dir) => {
          const commands = this.read(`${path}/${dir}/`);

          await Promise.all(commands.filter((file) => this.isFile(path, dir, file) && file.endsWith(".js")).map(async (file) => {
            const commandBase = new (await import(`../../commands/${dir}/${file}`)).default;

            if (commandBase?.data) {
              this.commands.cache.set(commandBase.data.name, commandBase);

              const command = this.commands.cache.get(commandBase.data.name);

              if (command.enabled && !command.support) {
                this.commands.cache.set(command.data.name, command);
                storage.push(command.data);
              };

              loadedCommands.push(command.data);

              body = {
                path: path,
                dir: dir,
                file: file,
                name: command.data.name,
                size: (commands.length + 1),
                loaded: ((loadedCommands.length + 1) - 1)
              };

              this.emit("commandLoaded", body);
            };
          }));
        }));

        this.emit("commandsReady", chalk.yellowBright("[Loader] Commands Ready."), loadedCommands);
      } catch (err) {
        this.emit("error", {
          type: "COMMAND",
          error: err,
          body: body
        });
      };

      return {
        commands: loadedCommands
      };
    };

    this.Setup = function () {
      // databases.map((db) => db.on("dataFetchRequest", (key, val) => console.log(key, val)))

      this.EventSetup();
      this.HandlerSetup();
      this.CommandSetup();

      let body = {};

      return client.login(Data.Bot.TOKEN).then(() => this.emit("ready", chalk.grey("[Client] Connected to Gateway."), storage)).catch((err) => this.emit("error", { type: "BOT", error: err, body: body }));
    };

    this.isFile = function (path, dir, file) {
      if (typeof path !== "string") throw new TypeError("PATH must be a STRING!");
      if (typeof dir !== "string") throw new TypeError("DIR must be a STRING!");
      if (typeof file !== "string") throw new TypeError("FILE must be a STRING!");

      const scanFile = statSync(this.resolve(path + "/" + dir + "/" + file)).isFile();

      return scanFile;
    };

    this.isFolder = function (path, dir) {
      if (typeof path !== "string") throw new TypeError("PATH must be a STRING!");
      if (typeof dir !== "string") throw new TypeError("DIR must be a STRING!");

      const scanFolder = statSync(this.resolve(path + "/" + dir)).isDirectory();

      return scanFolder;
    };

    this.resolve = function (path) {
      if (typeof path !== "string") throw new TypeError("PATH must be a STRING!");

      return resolve(path);
    };

    this.read = function (path) {
      if (typeof path !== "string") throw new TypeError("PATH must be a STRING!");

      return readdirSync(this.resolve(path));
    };
  };
};