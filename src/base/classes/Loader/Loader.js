import { statSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

import { Events } from "discord.js";

import { CommandsCache, EventsCache, HandlersCache } from "./LoaderCache.js";

import { Data } from "../../../config/export.js";

import EventEmitter from "node:events";

import chalk from "chalk";

export class Loader extends EventEmitter {
  constructor(client, databases) {
    super();

    if(databases && !Array.isArray(databases)) throw new Error("Databases must be a array.");
    if (!client) throw new Error("Client isn't provided.");

    const storage = [];

    this.commands = {
      cache: CommandsCache
    };

    this.events = {
      types: Events,
      cache: EventsCache
    };

    this.handlers = {
      types: this.events.types,
      cache: HandlersCache
    };

    this.HandlerSetup = async function () {
      const path = this.resolve("./src/base/events/handlers");

      const loadedHandlers = [];

      try {
        await Promise.all(this.read(path).filter((file) => this.isFile(path, "/../handlers", file) && file.endsWith(".js")).map(async (file) => {
          const handlerBase = new (await import(`../../events/handlers/${file}`)).default;

          if (handlerBase?.name && handlerBase?.enabled) {
            this.handlers.cache.set(handlerBase.name, handlerBase);

            const handler = this.handlers.cache.get(handlerBase.name);

            client.on(handler.name, async (...args) => {
              if (!handler?.type) return await handler.execute(...args);
              else if (handler.type === "Menu") {
                if (args.map((a) => a.isSelectMenu())) return await handler.execute(...args);
              } else if (handler.type === "Button") {
                if (args.map((a) => a.isButton())) return await handler.execute(...args);
              } else if (handler.type === "Modal") {
                if (args.map((a) => a.isModalSubmit())) return await handler.execute(...args);
              };
            });

            loadedHandlers.push(handler.name);

            this.emit("handlerLoaded", {
              path: path,
              file: file,
              name: handler.name,
              type: handler?.type,
              size: (path.length + 1),
              loaded: ((loadedHandlers.length + 1) - 1)
            });
          };
        }));

        this.emit("handlersReady", chalk.greenBright("[Loader] Handlers Ready."));
      } catch (err) {
        this.emit("error", { type: "HANDLER", error: err });
      };
    };

    this.EventSetup = async function () {
      const path = this.resolve("./src/base/events");

      const loadedEvents = [];

      try {
        await Promise.all(this.read(path).filter((dir) => this.isFolder(path, dir)).map(async (dir) => {
          if (dir === "handlers") return;

          const events = this.read(`${path}/${dir}`);

          await Promise.all(events.filter((file) => this.isFile(path, dir, file) && file.endsWith(".js")).map(async (file) => {
            const eventBase = new (await import(`../../events/${dir}/${file}`)).default;

            if (eventBase?.name && eventBase?.enabled) {
              this.events.cache.set(eventBase.name, eventBase);

              const event = this.events.cache.get(eventBase.name);

              if (!event.once && !event.process && !event.database) client.on(event.name, async (...interactions) => {
                if (!event?.type) return await event.execute(...interactions);
                else if (event.type === "UserMenu") {
                  if (interactions.map((interaction) => interaction.isUserSelectMenu())) return await event.execute(...interactions);
                } else if (event.type === "StringMenu") {
                  if (interactions.map((interaction) => interaction.isStringSelectMenu())) return await event.execute(...interactions);
                } else if (event.type === "Button") {
                  if (interactions.map((interaction) => interaction.isButton())) return await event.execute(...interactions);
                } else if (event.type === "Modal") {
                  if (interactions.map((interaction) => interaction.isModalSubmit())) return await event.execute(...interactions);
                };
              });
              else if (event.once && !event.process && !event.database) client.once(event.name, async (...interactions) => await event.execute(...interactions));
              else if (event.process) process.on(event.name, (...args) => event.execute(...args));
              else if (event.database) databases.map((database) => database.on(event.name, async (...args) => await event.execute(...args)));

              loadedEvents.push(event.name);

              this.emit("eventLoaded", {
                path: path,
                dir: dir,
                file: file,
                name: event.name,
                type: event?.type,
                process: event.process,
                size: (events.length + 1),
                loaded: ((loadedEvents.length + 1) - 1),
                once: event.once
              });
            };
          }))
        }));

        this.emit("eventsReady", chalk.blueBright("[Loader] Events Ready."));
      } catch (err) {
        this.emit("error", {
          type: "EVENT",
          error: err
        });
      };
    };

    this.CommandSetup = async function () {
      const path = this.resolve("./src/base/commands");

      const loadedCommands = [];

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

              loadedCommands.push(command.data.name);

              this.emit("commandLoaded", {
                path: path,
                dir: dir,
                file: file,
                name: command.data.name,
                size: (commands.length + 1),
                loaded: ((loadedCommands.length + 1) - 1)
              });
            };
          }));
        }));

        this.emit("commandsReady", chalk.yellowBright("[Loader] Commands Ready."));
      } catch (err) {
        this.emit("error", { type: "COMMAND", error: err });
      };
    };

    this.Setup = function () {
      this.HandlerSetup();
      this.EventSetup();
      this.CommandSetup();

      return client.login(Data.Bot.TOKEN).then(() => this.emit("ready", chalk.grey("[Client] Connected to Gateway."), storage)).catch((err) => this.emit("error", { type: "BOT", error: err }));
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