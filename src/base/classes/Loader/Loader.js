import { statSync, readdirSync } from "node:fs";
import { URL } from "node:url";
const resolve = (path) => ((new URL(path, import.meta.url).pathname).substring(1));

import { CommandsCache, EventsCache, HandlersCache, LanguagesCache } from "./LoaderCache.js";
import { Events as LoaderEvents } from "./Events.js";

import { Structure } from "../../structures/export.js";

import EventEmitter from "node:events";

import ora from "ora";

import AsciiTable from "ascii-table";

import { Checker as BaseChecker } from "../Checker/Checker.js";
const Checker = BaseChecker.BaseChecker;

const strc = new Structure();
const dbs = strc.databases;

import { NodeVersion } from "../../structures/base/error/Error.js";

import Data from "../../../config/Data.js";

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
   * @param {boolean} detailedMode
   * @param {string} runner 
   * @returns {Promise<void>}
   */
  async Handler(detailedMode, runner) {
    const table = new AsciiTable("Handler Loader");

    table.setHeading("Name", "Loaded", "Cached", "Runner", "Once", "Type");

    const runnerError = new Checker(runner).Error;
    runnerError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'runner'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const path = resolve("../../utils/handlers");

    let body = {};
    let spinner = null;

    if (!detailedMode) spinner = ora(strc.translate("data:loader.handlers.loading")).start();

    const source = this.read(path).filter((file) => file.endsWith(".js"));

    let total = source.length;
    let loaded = 0;

    for (let index = 0; index < source.length; index++) {
      const file = source[ index ]

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
          if (spinner) spinner.text = strc.translate("data:loader.handlers.loading", { variables: [ { name: "loaded", value: loaded }, { name: "total", value: total } ] });

          body = {
            path: path,
            file: file,
            name: handler.name,
            type: handler?.type,
            total: total,
            loaded: loaded
          };

          if (detailedMode) table.addRow(handler.name, "Yes", this.handlers.has(handler.name) ? "Yes" : "No", runCommand, handler?.once ? "Yes" : "No", handler?.type ?? "None");

          this.emit(this.Events.HandlerLoaded, body);
        };
      }).catch((err) => {
        this.emit(this.Events.Error, {
          type: "HANDLER",
          error: err,
          body: body
        });

        if (spinner) spinner.fail(strc.translate("data:loader.handlers.loadingError", { variables: [ { name: "err", value: err } ] }));
      });
    };

    this.emit(this.Events.HandlersReady, loaded, total);

    if (detailedMode) {
      console.log(table.toString());
      table.clearRows();
    };

    if (spinner) spinner.succeed(strc.translate("data:loader.handlers.loaded", { variables: [ { name: "loaded", value: loaded }, { name: "total", value: total } ] }));

    return void total;
  };

  /**
   * Install events.
   * @param {boolean} detailedMode
   * @param {string} runner 
   * @returns {Promise<void>}
   */
  async Event(detailedMode, runner) {
    const table = new AsciiTable("Event Loader");

    table.setHeading("Name", "Loaded", "Cached", "Runner", "Once", "Type", "Structure");

    const runnerError = new Checker(runner).Error;
    runnerError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'runner'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const path = resolve("../../utils/events");

    let body = {};
    let spinner = null;

    if (!detailedMode) spinner = ora(strc.translate("data:loader.events.loading")).start();

    let total = 0;
    let loaded = 0;

    const source = this.read(path).filter((dir) => this.statSync(`${path}/${dir}`).isFolder);

    for (let index = 0; index < source.length; index++) {
      const dir = source[ index ];

      const events = this.read(`${path}/${dir}`).filter((file) => file.endsWith(".js"));
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
            if (spinner) spinner.text = strc.translate("data:loader.events.loading", { variables: [ { name: "loaded", value: loaded }, { name: "total", value: total } ] });

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

            const getStructure = () => {
              if (event.database) return "Database";
              else if (event.process) return "Process";
              else if (event._client) return "Client";
              else return "None";
            };

            if (detailedMode) table.addRow(event.name, "Yes", this.events.has(event.name) ? "Yes" : "No", runCommand, event?.once ? "Yes" : "No", event?.type ?? "None", getStructure());

            this.emit(this.Events.EventLoaded, body);
          };
        }).catch((err) => {
          this.emit(this.Events.Error, {
            type: "EVENT",
            error: err,
            body: body
          });

          if (spinner) spinner.fail(strc.translate("data:loader.events.loadingError", { variables: [ { name: "err", value: err } ] }));
        });
      };
    };

    this.emit(this.Events.EventsReady, loaded, total);

    if (detailedMode) {
      console.log(table.toString());
      table.clearRows();
    };

    if (spinner) spinner.succeed(strc.translate("data:loader.events.loaded", { variables: [ { name: "loaded", value: loaded }, { name: "total", value: total } ] }));

    return void total;
  };

  /**
   * Install commands.
   * @param {boolean} detailedMode
   * @returns {Promise<void>}
   */
  async Command(detailedMode) {
    const table = new AsciiTable("Command Loader");

    table.setHeading("Name", "Type", "Loaded", "Cached");

    let total = 0;
    let loaded = 0;

    const commandsData = [];

    const folders = [ "slash", "context" ];

    let spinner = null;

    if (!detailedMode) spinner = ora(strc.translate("data:loader.commands.loading")).start();

    for (let i = 0; i < folders.length; i++) {
      const folder = folders[ i ];

      const path = resolve(`../../commands/${folder}`);

      let body = {};

      const source = this.read(path).filter((dir) => this.statSync(`${path}/${dir}`).isFolder);

      for (let index = 0; index < source.length; index++) {
        const dir = source[ index ];

        const commands = this.read(`${path}/${dir}`).filter((file) => file.endsWith(".js"));
        total += commands.length;

        for (let index2 = 0; index2 < commands.length; index2++) {
          const file = commands[ index2 ];

          await (import(`../../commands/${folder}/${dir}/${file}`)).then((commandSource) => {
            const command = new (commandSource).default();

            if (command.data?.name && command?.enabled) {
              this.commands[ folder ].set(command.data.name, command);

              this.storage.push(command.data);
              commandsData.push(command.data);

              loaded++;
              if (spinner) spinner.text = strc.translate("data:loader.commands.loading", { variables: [ { name: "loaded", value: loaded }, { name: "total", value: total } ] });

              body = {
                path: path,
                dir: dir,
                file: file,
                name: command.data.name,
                total,
                loaded
              };

              if (detailedMode) table.addRow(command.data.name, folder === "slash" ? "Slash" : "Context", "Yes", this.commands[ folder === "slash" ? "slash" : "context" ].has(command.data.name) ? "Yes" : "No");

              this.emit(this.Events.CommandLoaded, body);
            };
          }).catch((err) => {
            this.emit(this.Events.Error, {
              type: "COMMAND",
              error: err,
              body: body
            });

            if (spinner) spinner.fail(strc.translate("data:loader.commands.loadingError", { variables: [ { name: "err", value: err } ] }));
          });
        };
      };
    };

    this.emit(this.Events.CommandsReady, commandsData, loaded, total);

    if (detailedMode) {
      console.log(table.toString());
      table.clearRows();
    };

    if (spinner) spinner.succeed(strc.translate("data:loader.commands.loaded", { variables: [ { name: "loaded", value: loaded }, { name: "total", value: total } ] }));

    return void loaded;
  };

  /**
   * Install languages
   * @param {boolean} detailedMode
   * @returns {Promise<void>}
   */
  async Language(detailedMode) {
    const table = new AsciiTable("Language Loader");

    table.setHeading("Code", "Direct Code", "Enabled", "Loaded", "Cached");

    let body = {};

    const path = resolve("../../languages");

    let spinner = null;

    if (!detailedMode) spinner = ora("Languages Loading").start();

    const source = this.read(path).filter((file) => this.statSync(`${path}/${file}`).isFile);

    let total = source.length;
    let loaded = 0;

    for (let index = 0; index < source.length; index++) {
      const file = source[ index ]

      await (import(`../../languages/${file}`)).then((language) => {
        const { enabled, data } = language.default;

        const code = file.split(".js")[ 0 ];
        const directCode = code.split("-")[ 0 ].toLowerCase();

        if (enabled) {

          const dataError = new Checker(data).Error;
          dataError.setName("ValidationError")
            .setMessage("An invalid type was specified for 'data'.")
            .setCondition("isNotObject")
            .setType("InvalidType")
            .throw();

          this.languages.set(code, data);
          this.languages.set(directCode, data);

          loaded++;
          if (spinner) spinner.text = `Languages Loading (${loaded}/${total})`;

          body = {
            code: code,
            directCode: directCode,
            source: data,
            total,
            loaded
          };

          if (detailedMode) table.addRow(code, directCode, "Yes", "Yes", this.languages.has(code) ? "Yes" : "No");

          this.emit(this.Events.LanguageLoaded, body);
        } else {
          if (detailedMode) table.addRow(code, directCode, "No", "No", this.languages.has(code) ? "Yes" : "No");
        };
      }).catch((err) => {
        this.emit(this.Events.Error, {
          type: "LANG",
          error: err,
          body: body
        });

        if (spinner) spinner.fail("An error ocurred when loading languages. | {err}".replace("{err}", err));
      });
    };

    this.emit(this.Events.LanguagesReady, loaded, total);

    if (detailedMode) {
      console.log(table.toString());
      table.clearRows();
    };

    if (spinner) spinner.succeed(`Languages Loaded. (${loaded}/${total})`);

    return void loaded;
  };

  /**
   * Setup all utils for bot.
   * @param {boolean} detailedMode
   * @returns {Promise<void>}
   */
  async Setup(detailedMode = Data.Loader.DETAILS) {
    let processing = 1;

    await this.Language(detailedMode);
    processing++;

    let spinner;
    if (!detailedMode) spinner = ora(strc.translate("data:loader.gateway.connecting")).start();

    await this.Event(detailedMode).then(() => {
      processing++;
      if (spinner) spinner.text = strc.translate("data:loader.gateway.connecting", { variables: [ { name: "processing", value: processing }, { name: "total", value: 5 } ] })
    });

    await this.Handler(detailedMode).then(() => {
      processing++;
      if (spinner) spinner.text = strc.translate("data:loader.gateway.connecting", { variables: [ { name: "processing", value: processing }, { name: "total", value: 5 } ] });
    });

    await this.Command(detailedMode).then(() => {
      processing++;
      if (spinner) spinner.text = strc.translate("data:loader.gateway.connecting", { variables: [ { name: "processing", value: processing }, { name: "total", value: 5 } ] })
    });

    await this.client.login(this.client.TOKEN).then(() => {
      this.emit("ready", 0);

      spinner?.succeed(strc.translate("data:loader.gateway.connected", { variables: [ { name: "processing", value: processing }, { name: "total", value: 5 } ] }));
    }).catch((err) => spinner?.fail(strc.translate("data:loader.gateway.connectionError", { variables: [ { name: "err", value: err } ] })));

    return void 0;
  };

  /**
   * @param {string} path 
   * @returns 
   * @protected
   */
  statSync(path) {
    const target = statSync("C:/" + resolve(path));

    return {
      isFile: target.isFile(),
      isFolder: target.isDirectory()
    };
  };

  /**
   * @param {string} path 
   * @returns {string}
   * @protected
   */
  read(path) {
    return (readdirSync("C:/" + resolve(path)));
  };
};