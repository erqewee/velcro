import { statSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

import { CommandsCache, EventsCache, HandlersCache, LanguagesCache } from "./LoaderCache.js";
import { Events as LoaderEvents } from "./Events.js";

import { Structure } from "../../structures/export.js";

import EventEmitter from "node:events";

import ora from "ora";

import { Checker as BaseChecker } from "../Checker/Checker.js";
const Checker = BaseChecker.BaseChecker;

import { Translations } from "../../languages/Translations.js";
const strc = new Structure();
const dbs = strc.databases;

import { NodeVersion } from "../../structures/base/error/Error.js";

const WAIT = async () => new Promise((resolve) => setTimeout(resolve, 1000));

export class Loader extends EventEmitter {
  constructor(client = null, databases = [ dbs.economy, dbs.general, dbs.subscribe ]) {
    super({ captureRejections: true });

    this.client = client;
    this.databases = databases;

    this.setMaxListeners(0);

    let required = 16;
    if (NodeVersion.version < required) throw new NodeVersion(required, strc.translate("data:loader.nodeError"));
  };

  commands = CommandsCache;
  events = EventsCache;
  handlers = HandlersCache;
  languages = LanguagesCache;

  storage = [];

  Events = LoaderEvents;

  /**
   * Install handlers.
   * @param {string} runner 
   * @returns {Promise<void>}
   */
  async Handler(runner) {
    const runnerError = new Checker(runner).Error;
    runnerError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'runner'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const path = this.#resolve("./src/base/utils/handlers");

    let body = {};

    const spinner = ora(strc.translate("data:loader.handlers.loading")).start();

    const source = this.#read(path).filter((file) => this.#isFile(`${path}/${file}`) && file.endsWith(".js"));

    let total = source.length;
    let loaded = 0;

    for (let index = 0; index < source.length; index++) {
      const file = source[ index ];

      await (import(`../../utils/handlers/${file}`)).then((handlerSource) => {
        const handler = new (handlerSource).default();

        if (handler?.name && handler?.enabled) {
          this.handlers.set(handler.name, handler);

          const fetchErrors = (error) => handler.error({ error });

          let runCommand = "execute";
          if (handler?.run) runCommand = "run";
          else if (runner && handler?.[ runner ]) runCommand = runner;

          const runnerCommandError = new Checker(handler?.[ runCommand ]).Error;
          runnerCommandError.setName("ValidationError")
            .setMessage("An invalid type was specified for 'runnerCommand'.")
            .setCondition("isNotFunction")
            .setType("InvalidType")
            .throw();

          let runType = "on";
          if (handler?.once) runType = "once";

          this.client[ runType ](handler.name, async (...listeners) => {
            if (handler?.type === "UserMenu" && listeners.map((listener) => listener?.customId && listener.isUserSelectMenu())) return await handler[ runCommand ](...listeners).catch(fetchErrors);
            else if (handler?.type === "StringMenu" && listeners.map((listener) => listener?.customId && listener.isStringSelectMenu())) return await handler[ runCommand ](...listeners).catch(fetchErrors);
            else if (handler?.type === "Button" && listeners.map((listener) => listener?.customId && listener.isButton())) return await handler[ runCommand ](...listeners).catch(fetchErrors);
            else if (handler?.type === "Modal" && listeners.map((listener) => listener?.customId && listener.isModalSubmit())) return await handler[ runCommand ](...listeners).catch(fetchErrors);
            else if (handler?.type === "ChatCommand" && listeners.map((listener) => !listener?.customId && listener?.isChatInputCommand && listener?.isChatInputCommand())) return await handler[ runCommand ](...listeners).catch(fetchErrors);
            else if (handler?.type === "ContextCommand" && listeners.map((listener) => !listener?.customId && listener?.isChatInputCommand && listener?.isContextMenuCommand())) return await handler[ runCommand ](...listeners).catch(fetchErrors);

            else return await handler[ runCommand ](...listeners).catch(fetchErrors);
          });

          loaded++;
          spinner.text = strc.translate("data:loader.handlers.loading", { variables: [ { name: "loaded", value: loaded }, { name: "total", value: total } ] });

          body = {
            path: path,
            file: file,
            name: handler.name,
            type: handler?.type,
            total: total,
            loaded: loaded
          };

          this.emit(this.Events.HandlerLoaded, body);
        };
      }).catch((err) => {
        this.emit(this.Events.Error, {
          type: "HANDLER",
          error: err,
          body: body
        });

        spinner.fail(strc.translate("data:loader.handlers.loadingError", { variables: [ { name: "err", value: err } ] }));
      });
    };

    this.emit(this.Events.HandlersReady, loaded, total);

    spinner.succeed(strc.translate("data:loader.handlers.loaded", { variables: [ { name: "loaded", value: loaded }, { name: "total", value: total } ] }));

    return void total;
  };

  /**
   * Install events.
   * @param {string} runner 
   * @returns {Promise<void>}
   */
  async Event(runner) {
    const runnerError = new Checker(runner).Error;
    runnerError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'runner'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const path = this.#resolve("./src/base/utils/events");

    let body = {};

    const spinner = ora(strc.translate("data:loader.events.loading")).start();

    let total = 0;
    let loaded = 0;

    const source = this.#read(path).filter((dir) => this.#isFolder(`${path}/${dir}`));

    for (let index = 0; index < source.length; index++) {
      const dir = source[ index ];

      const events = this.#read(`${path}/${dir}`).filter((file) => this.#isFile(`${path}/${dir}/${file}`) && file.endsWith(".js"));
      total += events.length;

      for (let size = 0; size < events.length; size++) {
        const file = events[ size ];

        await (import(`../../utils/events/${dir}/${file}`)).then((eventSource) => {
          const event = new (eventSource).default();

          if (event?.name && event?.enabled) {
            this.events.set(event.name, event);

            const fetchErrors = (error) => event.error({ error });

            let runCommand = "execute";
            if (event?.run) runCommand = "run";
            else if (runner && event?.[ runner ]) runCommand = runner;

            const runnerCommandError = new Checker(event?.[ runCommand ]).Error;
            runnerCommandError.setName("ValidationError")
              .setMessage("An invalid type was specified for 'runnerCommand'.")
              .setCondition("isNotFunction")
              .setType("InvalidType")
              .throw();

            let runType = "on";
            if (event?.once) runType = "once";

            let base = this.client;
            if (event?.process) base = process;

            if (!event.database) base[ runType ](event.name, async (...listeners) => {
              if (event?.type === "UserMenu" && listeners.map((listener) => listener?.customId && listener.isUserSelectMenu())) return await event[ runCommand ](...listeners).catch(fetchErrors);
              else if (event?.type === "StringMenu" && listeners.map((listener) => listener?.customId && listener.isStringSelectMenu())) return await event[ runCommand ](...listeners).catch(fetchErrors);
              else if (event?.type === "Button" && listeners.map((listener) => listener?.customId && listener.isButton())) return await event[ runCommand ](...listeners).catch(fetchErrors);
              else if (event?.type === "Modal" && listeners.map((listener) => listener?.customId && listener.isModalSubmit())) return await event[ runCommand ](...listeners).catch(fetchErrors);
              else if (event?.type === "ChatCommand" && listeners.map((listener) => !listener?.customId && listener?.isChatInputCommand && listener?.isChatInputCommand())) return await event[ runCommand ](...listeners).catch(fetchErrors);
              else if (event?.type === "ContextCommand" && listeners.map((listener) => !listener?.customId && listener?.isUserContextMenuCommand && listener?.isUserContextMenuCommand())) return await event[ runCommand ](...listeners).catch(fetchErrors);

              else return await event[ runCommand ](...listeners).catch(fetchErrors);
            });

            if (event.database && !event._client && !event.process) this.databases.map((database) => database[ runType ](event.name, async (...args) => await event[ runCommand ](...args).catch(fetchErrors)));

            loaded++;
            spinner.text = strc.translate("data:loader.events.loading", { variables: [ { name: "loaded", value: loaded }, { name: "total", value: total } ] });

            body = {
              path: path,
              dir: dir,
              file: file,
              name: event.name,
              type: event?.type,
              process: event.process,
              total: total,
              loaded: loaded,
              once: event.once
            };

            this.emit(this.Events.EventLoaded, body);
          };
        }).catch((err) => {
          this.emit(this.Events.Error, {
            type: "EVENT",
            error: err,
            body: body
          });

          spinner.fail(strc.translate("data:loader.events.loadingError", { variables: [ { name: "err", value: err } ] }));
        });
      }
    };

    this.emit(this.Events.EventsReady, loaded, total);

    spinner.succeed(strc.translate("data:loader.events.loaded", { variables: [ { name: "loaded", value: loaded }, { name: "total", value: total } ] }));

    return void total;
  };

  /**
   * Install slash commands.
   * @param {string} runner 
   * @returns {Promise<void>}
   */
  async SlashCommand(runner) {
    const runnerError = new Checker(runner).Error;
    runnerError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'runner'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const path = this.#resolve("./src/base/commands/slash");

    let body = {};

    const spinner = ora(strc.translate("data:loader.commands.slash.loading")).start();

    const source = this.#read(path).filter((dir) => this.#isFolder(`${path}/${dir}`));

    let total = 0;
    let loaded = 0;

    const commandsData = [];

    for (let index = 0; index < source.length; index++) {
      const dir = source[ index ];

      const commands = this.#read(`${path}/${dir}`);
      total += commands.length;

      for (let index2 = 0; index2 < commands.length; index2++) {
        const file = commands[ index2 ];

        await (import(`../../commands/slash/${dir}/${file}`)).then((commandSource) => {
          const command = new (commandSource).default();

          if (command.data?.name && command?.enabled) {
            this.commands.slash.set(command.data.name, command);

            this.storage.push(command.data);
            commandsData.push(command.data);

            loaded++;
            spinner.text = strc.translate("data:loader.commands.slash.loading", { variables: [ { name: "loaded", value: loaded }, { name: "total", value: total } ] });

            body = {
              path: path,
              dir: dir,
              file: file,
              name: command.data.name,
              total: total,
              loaded: loaded
            };

            this.emit(this.Events.SlashCommandLoaded, body);
          };
        }).catch((err) => {
          this.emit(this.Events.Error, {
            type: "COMMAND",
            error: err,
            body: body
          });

          spinner.fail(strc.translate("data:loader.commands.slash.loadingError", { variables: [ { name: "err", value: err } ] }));
        });
      };
    };

    this.emit(this.Events.SlashCommandsReady, commandsData, loaded, total);

    spinner.succeed(strc.translate("data:loader.commands.slash.loaded", { variables: [ { name: "loaded", value: loaded }, { name: "total", value: total } ] }));

    return void loaded;
  };

  /**
   * Install context commands.
   * @param {string} runner 
   * @returns {Promise<void>}
   */
  async ContextCommand(runner) {
    const runnerError = new Checker(runner).Error;
    runnerError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'runner'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const path = this.#resolve("./src/base/commands/context");

    let body = {};

    const spinner = ora(strc.translate("data:loader.commands.context.loading")).start();

    const source = this.#read(path).filter((dir) => this.#isFolder(`${path}/${dir}`));

    let total = 0;
    let loaded = 0;

    const commandsData = [];

    for (let index = 0; index < source.length; index++) {
      const dir = source[ index ];

      const commands = this.#read(`${path}/${dir}`);
      total += commands.length;

      for (let index2 = 0; index2 < commands.length; index2++) {
        const file = commands[ index2 ];

        await (import(`../../commands/context/${dir}/${file}`)).then((commandSource) => {
          const command = new (commandSource).default();

          if (command.data?.name && command?.enabled) {
            this.commands.context.set(command.data.name, command);

            this.storage.push(command.data);
            commandsData.push(command.data);

            loaded++;
            spinner.text = strc.translate("data:loader.commands.context.loading", { variables: [ { name: "loaded", value: loaded }, { name: "total", value: total } ] });

            body = {
              path: path,
              dir: dir,
              file: file,
              name: command.data.name,
              total,
              loaded
            };

            this.emit(this.Events.ContextCommandLoaded, body);
          };
        }).catch((err) => {
          this.emit(this.Events.Error, {
            type: "COMMAND",
            error: err,
            body: body
          });

          spinner.fail(strc.translate("data:loader.commands.context.loadingError", { variables: [ { name: "err", value: err } ] }));
        });
      };
    };

    this.emit(this.Events.ContextCommandsReady, commandsData, loaded, total);

    spinner.succeed(strc.translate("data:loader.commands.context.loaded", { variables: [ { name: "loaded", value: loaded }, { name: "total", value: total } ] }));

    return void loaded;
  };

  /**
   * Install languages
   * @returns {void}
   */
  Language() {
    let body = {};

    const spinner = ora("Languages Loading").start();
    const languages = new Translations().Languages;

    let total = languages.length;
    let loaded = 0;

    for (let index = 0; index < languages.length; index++) {
      const language = languages[ index ];

      try {
        const { code, source } = language;

        if (source?.enabled === false) break;

        const directCode = code.split("-")[ 0 ].toLowerCase();

        const sourceError = new Checker(source?.data).Error;
        sourceError.setName("ValidationError")
          .setMessage("An invalid type was specified for 'source'.")
          .setCondition("isNotObject")
          .setType("InvalidType")
          .throw();

        this.languages.set(code, source.data);
        this.languages.set(directCode, source.data);

        loaded++;
        spinner.text = `Languages Loading (${loaded}/${total})`;

        body = {
          code: code,
          directCode: directCode,
          source: source,
          total,
          loaded
        };

        this.emit(this.Events.LanguageLoaded, body);
      } catch (err) {
        this.emit(this.Events.Error, {
          type: "LANG",
          error: err,
          body: body
        });

        spinner.fail("An error ocurred when loading languages. | {err}".replace("{err}", err));
      };
    };

    this.emit(this.Events.LanguagesReady, loaded, total);

    spinner.succeed(`Languages Loaded. (${loaded}/${total})`);

    return void loaded;
  };

  /**
   * Setup all utils for bot.
   * @returns {Promise<void>}
   */
  async Setup() {
    this.Language();

    const spinner = ora(strc.translate("data:loader.gateway.connecting")).start();

    await this.Event().then(() => spinner.text = strc.translate("data:loader.gateway.connecting", { variables: [ { name: "processing", value: 2 }, { name: "total", value: 6 } ] }));
    await this.Handler().then(() => spinner.text = strc.translate("data:loader.gateway.connecting", { variables: [ { name: "processing", value: 3 }, { name: "total", value: 6 } ] }));
    // await WAIT();
    await this.SlashCommand().then(() => spinner.text = strc.translate("data:loader.gateway.connecting", { variables: [ { name: "processing", value: 4 }, { name: "total", value: 6 } ] }));
    await this.ContextCommand().then(() => spinner.text = strc.translate("data:loader.gateway.connecting", { variables: [ { name: "processing", value: 5 }, { name: "total", value: 6 } ] }));

    this.client.login(this.client.TOKEN).then(() => {
      this.emit("ready", 0);

      spinner.succeed(strc.translate("data:loader.gateway.connected", { variables: [ { name: "processing", value: 6 }, { name: "total", value: 6 } ] }));
    }).catch((err) => spinner.fail(strc.translate("data:loader.gateway.connectionError", { variables: [ { name: "err", value: err } ] })));

    return;
  };

  #isFile(path) {
    return (statSync(this.#resolve(path)).isFile());
  };

  #isFolder(path) {
    return (statSync(this.#resolve(path)).isDirectory());
  };

  #resolve(path = "./src") {
    return (resolve(path));
  };

  #read(path) {
    return (readdirSync(this.#resolve(path)));
  };
};