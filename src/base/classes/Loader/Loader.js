import { statSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

import { Events } from "discord.js";

import { LoaderCache } from "./LoaderCache.js";

import { Data } from "../../../config/export.js";

import EventEmitter from "node:events";

import chalk from "chalk";

export class Loader extends EventEmitter {
  constructor(client) {
    super();

    if (!client) throw new Error("Client isn't provided.");

    const storage = [];

    this.commands = {
      cache: LoaderCache
    };

    this.events = Events;

    this.HandlerSetup = async function () {
      const path = this.resolve("./src/base/events/handlers");

      const size = [];

      try {
        await Promise.all(this.read(path).filter((file) => this.isFile(path, "/../handlers", file) && file.endsWith(".js")).map(async (file) => {
          const handler = new (await import(`../../events/handlers/${file}`)).default;

          if (handler.name) {
            size.push(handler.name);
            client.on(handler.name, async (...args) => {
              if (!handler?.type) {
                return await handler.execute(...args);
              };

              if (handler.type === "Menu") {
                if (args.map((a) => a.isSelectMenu())) return await handler.execute(...args);
              };

              if (handler.type === "Button") {
                if (args.map((a) => a.isButton())) return await handler.execute(...args);
              };

              if (handler.type === "Modal") {
                if (args.map((a) => a.isModalSubmit())) return await handler.execute(...args);
              };
            });

            this.emit("handlerLoaded", { 
              path: path, 
              file: file, 
              name: handler.name, 
              type: handler?.type, 
              loaded: size.length
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

      const size = [];

      try {
        await Promise.all(this.read(path).filter((dir) => this.isFolder(path, dir)).map(async (dir) => {
          if (dir === "handlers") return;

          await Promise.all(this.read(`${path}/${dir}`).filter((file) => this.isFile(path, dir, file) && file.endsWith(".js")).map(async (file) => {
            const event = new (await import(`../../events/${dir}/${file}`)).default;

            if (event.name) {
              if (!event.once && !event.process) {
                size.push(event.name);
                client.on(event.name, async (...args) => {
                  if (!event?.type) {
                    return await event.execute(...args);
                  };

                  if (event.type === "StringMenu") {
                    if (args.map((a) => a.isStringSelectMenu())) return await event.execute(...args);
                  };

                  if (event.type === "Button") {
                    if (args.map((a) => a.isButton())) return await event.execute(...args);
                  };

                  if (event.type === "Modal") {
                    if (args.map((a) => a.isModalSubmit())) return await event.execute(...args);
                  };
                });
              } else if (event.once && !event.process) {
                size.push(event.name);
                client.once(event.name, async (...args) => await event.execute(...args));
              } else if (event.process) {
                size.push(event.name);
                process.on(event.name, (...args) => event.execute(...args));
              };

              this.emit("eventLoaded", { 
                path: path, 
                dir: dir, 
                file: file, 
                name: event.name, 
                type: event?.type, 
                process: event.process, 
                loaded: size.length,
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

      const size = [];

      try {
        await Promise.all(this.read(path).filter((dir) => this.isFolder(path, dir)).map(async (dir) => {
          await Promise.all(this.read(`${path}/${dir}/`).filter((file) => this.isFile(path, dir, file) && file.endsWith(".js")).map(async (file) => {
            const command = new (await import(`../../commands/${dir}/${file}`)).default;

            if (command.data && command.enabled && !command.support) {
              size.push(command.data.name);
              this.commands.cache.set(command.data.name, command);
              storage.push(command.data);

              this.emit("commandLoaded", { 
                path: path, 
                dir: dir, 
                file: file, 
                name: command.data.name, 
                loaded: size.length 
              });
            };
          }));
        }));

        this.emit("commandsReady", chalk.yellowBright("[Loader] Handlers Ready."));
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