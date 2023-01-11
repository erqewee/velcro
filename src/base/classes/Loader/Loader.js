import { statSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

import { CommandsCache, EventsCache, HandlersCache, LanguagesCache } from "./LoaderCache.js";
import { Events as LoaderEvents } from "./Events.js";

import { Structure } from "../../structures/export.js";

import { Data } from "../../../config/export.js";

import EventEmitter from "node:events";

import ora from "ora";

import { Checker as BaseChecker } from "../Checker/Checker.js";
const Checker = BaseChecker.BaseChecker;

import { Translations } from "../../languages/Translations.js";

const dbs = new Structure().databases;

export class Loader extends EventEmitter {
  constructor(client = null, databases = [dbs.economy, dbs.general, dbs.subscribe]) {
    super();

    this.client = client;
    this.databases = databases;

    this.setMaxListeners(0);
  };

  commands = CommandsCache;
  events = EventsCache;
  handlers = HandlersCache;
  languages = LanguagesCache;

  storage = [];

  Events = LoaderEvents;

  async Handler(runner) {
    const runnerChecker = new Checker(runner);
    runnerChecker.createError(!runnerChecker.isString, "runner", { expected: "String", received: runnerChecker }).throw();

    const path = this.#resolve("./src/base/events/handlers");

    let body = {};

    const loadedHandlers = [];

    const spinner = ora("Handlers Loading").start();

    await Promise.all(this.#read(path).filter((file) => this.#isFile(path, "/../handlers", file) && file.endsWith(".js")).map(async (file) => {
      const handlerBase = new (await import(`../../events/handlers/${file}`)).default;

      if (handlerBase?.name && handlerBase?.enabled) {
        this.handlers.set(handlerBase.name, handlerBase);

        const handler = this.handlers.get(handlerBase.name);

        let runCommand = "execute";
        if (handler?.run) runCommand = "run";
        else if (runner && handler?.[runner]) runCommand = runner;

        const runCommandChecker = new Checker(handler?.[runCommand]);
        runCommandChecker.createError(!runCommandChecker.isFunction, "runner", { expected: "Function", received: handler?.[runCommand] }).throw();

        let runType = "on";
        if (handler?.once) runType = "once";

        this.client[runType](handler.name, async (...listeners) => {
          if (handler?.type === "UserMenu" && listeners.map((listener) => listener?.customId && listener.isUserSelectMenu())) return await handler[runCommand](...listeners);
          else if (handler?.type === "StringMenu" && listeners.map((listener) => listener?.customId && listener.isStringSelectMenu())) return await handler[runCommand](...listeners);
          else if (handler?.type === "Button" && listeners.map((listener) => listener?.customId && listener.isButton())) return await handler[runCommand](...listeners);
          else if (handler?.type === "Modal" && listeners.map((listener) => listener?.customId && listener.isModalSubmit())) return await handler[runCommand](...listeners);
          else if (handler?.type === "ChatCommand" && listeners.map((listener) => !listener?.customId && listener?.isChatInputCommand && listener?.isChatInputCommand())) return await handler[runCommand](...listeners);
          else if (handler?.type === "ContextCommand" && listeners.map((listener) => !listener?.customId && listener?.isChatInputCommand && listener?.isContextMenuCommand())) return await handler[runCommand](...listeners);
          
          else return await handler[runCommand](...listeners);
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

        this.emit(this.Events.HandlerLoaded, body);
      };
    })).catch((err) => {
      this.emit(this.Events.Error, {
        type: "HANDLER",
        error: err,
        body: body
      });

      spinner.fail(`An error ocurred when loading handlers. | ${err}`);
    }).finally(() => {
      this.emit(this.Events.HandlersReady, loadedHandlers);

      spinner.succeed("Handlers Loaded.");
    });

    return loadedHandlers;
  };

  async Event(runner) {
    const runnerChecker = new Checker(runner);
    runnerChecker.createError(!runnerChecker.isString, "runner", { expected: "String", received: runnerChecker }).throw();

    const path = this.#resolve("./src/base/events");

    const loadedEvents = [];

    let body = {};

    const spinner = ora("Events Loading").start();

    await Promise.all(this.#read(path).filter((dir) => this.#isFolder(path, dir)).map(async (dir) => {
      if (dir === "handlers") return;

      const events = this.#read(`${path}/${dir}`);

      await Promise.all(events.filter((file) => this.#isFile(path, dir, file) && file.endsWith(".js")).map(async (file) => {
        const eventBase = new (await import(`../../events/${dir}/${file}`)).default;

        if (eventBase?.name && eventBase?.enabled) {
          this.events.set(eventBase.name, eventBase);

          const event = this.events.get(eventBase.name);

          let runCommand = "execute";
          if (event?.run) runCommand = "run";
          else if (runner && event?.[runner]) runCommand = runner;

          const runCommandChecker = new Checker(event?.[runCommand]);
          runCommandChecker.createError(!runCommandChecker.isFunction, "runner", { expected: "Function", received: event?.[runCommand] }).throw();

          let runType = "on";
          if (event?.once) runType = "once";

          let base = this.client;
          if (event?.process) base = process;

          if (!event.database) base[runType](event.name, async (...listeners) => {
            if (event?.type === "UserMenu" && listeners.map((listener) => listener?.customId && listener.isUserSelectMenu())) return await event[runCommand](...listeners);
            else if (event?.type === "StringMenu" && listeners.map((listener) => listener?.customId && listener.isStringSelectMenu())) return await event[runCommand](...listeners);
            else if (event?.type === "Button" && listeners.map((listener) => listener?.customId && listener.isButton())) return await event[runCommand](...listeners);
            else if (event?.type === "Modal" && listeners.map((listener) => listener?.customId && listener.isModalSubmit())) return await event[runCommand](...listeners);
            else if (event?.type === "ChatCommand" && listeners.map((listener) => !listener?.customId && listener?.isChatInputCommand && listener?.isChatInputCommand())) return await event[runCommand](...listeners);
            else if (event?.type === "ContextCommand" && listeners.map((listener) => !listener?.customId && listener?.isChatInputCommand && listener?.isContextMenuCommand())) return await event[runCommand](...listeners);

            else return await event[runCommand](...listeners);
          });

          if (!event._client && event.database && !event.process) this.databases.map((database) => database[runType](event.name, async (...args) => await event[runCommand](...args)));

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

          this.emit(this.Events.EventLoaded, body);
        };
      }))
    })).catch((err) => {
      this.emit(this.Events.Error, {
        type: "EVENT",
        error: err,
        body: body
      });

      spinner.fail(`An error ocurred when loading events. | ${err}`);
    }).finally(() => {
      this.emit(this.Events.EventsReady, loadedEvents);

      spinner.succeed("Events Loaded.");
    });

    return loadedEvents;
  };

  async Command(runner) {
    const runnerChecker = new Checker(runner);
    runnerChecker.createError(!runnerChecker.isString, "runner", { expected: "String", received: runnerChecker }).throw();

    const path = this.#resolve("./src/base/commands");

    const loadedCommands = [];

    let body = {};

    const spinner = ora("Commands Loading").start();

    await Promise.all(this.#read(path).filter((dir) => this.#isFolder(path, dir)).map(async (dir) => {
      const commands = this.#read(`${path}/${dir}/`);

      await Promise.all(commands.filter((file) => this.#isFile(path, dir, file) && file.endsWith(".js")).map(async (file) => {
        const commandBase = new (await import(`../../commands/${dir}/${file}`)).default;

        if (commandBase?.data && commandBase?.enabled) {
          this.commands.set(commandBase.data.name, commandBase);

          const command = this.commands.get(commandBase.data.name);

          this.storage.push(command.data);

          loadedCommands.push(command.data);

          body = {
            path: path,
            dir: dir,
            file: file,
            name: command.data.name,
            size: (commands.length + 1),
            loaded: ((loadedCommands.length + 1) - 1)
          };

          this.emit(this.Events.CommandLoaded, body);
        };
      }));
    })).catch((err) => {
      this.emit(this.Events.Error, {
        type: "COMMAND",
        error: err,
        body: body
      });

      spinner.fail(`An error ocurred when loading commands. | ${err}`);
    }).finally(() => {
      this.emit(this.Events.CommandsReady, loadedCommands);

      spinner.succeed("Commands Loaded.");
    });

    return loadedCommands;
  };

  async Language() {
    const loadedLanguages = [];

    let body = {};

    const spinner = ora("Languages Loading").start();
    const languageSource = new Translations();

    await Promise.all(languageSource.Languages.map((lang) => {
      const { code, source } = lang;
      const directCode = String(code).split("-")[0];

      this.languages.set(code, source.data);
      this.languages.set(directCode, source.data);

      loadedLanguages.push(lang);

      body = {
        code: code,
        directCode: directCode,
        source: source
      };

      this.emit(this.Events.LanguageLoaded, body);
    })).catch((err) => {
      this.emit(this.Events.Error, {
        type: "LANG",
        error: err,
        body: body
      });

      spinner.fail(`An error ocurred when loading languages. | ${err}`);
    }).finally(() => {
      this.emit(this.Events.LanguagesReady, loadedLanguages);

      spinner.succeed("Languages Loaded.");
    });

    return loadedLanguages;
  };

  Setup() {
    const spinner = ora("Connecting to Gateway...").start();

    this.Language();
    this.Event();
    this.Handler();
    this.Command();

    this.client.login(Data.Bot.TOKEN).then(() => {
      this.emit("ready", 0);

      spinner.succeed("Connected to Gateway.");
    }).catch((err) => spinner.fail(`An error ocurred when connecting to gateway. | ${err}`));

    return 0;
  };

  #isFile(path, dir, file) {
    const scanFile = statSync(this.#resolve(path + "/" + dir + "/" + file)).isFile();

    return scanFile;
  };

  #isFolder(path, dir) {
    const scanFolder = statSync(this.#resolve(path + "/" + dir)).isDirectory();

    return scanFolder;
  };

  #resolve(path = "./src") {
    return resolve(path);
  };

  #read(path) {
    return readdirSync(this.#resolve(path));
  };
};