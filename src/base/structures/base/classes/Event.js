import { WebhookClient as Client, Events } from "discord.js";
import { Structure as EventStructure } from "../Structure.js";

import { Database } from "../../../classes/Database/Database.js";

export class Event extends EventStructure {
  constructor(eventOptions = { name: null, enabled: true, modes: [], type: "ChatCommand" }) {
    super();

    this.name = eventOptions.name;
    this.type = eventOptions.type;
    this.modes = eventOptions?.modes;

    const enabledChecker = new this.checker.BaseChecker(eventOptions?.enabled);
    const modesChecker = new this.checker.BaseChecker(eventOptions?.modes);

    if (enabledChecker.isBoolean && eventOptions.enabled === true) this.setEnabled();
    if (modesChecker.isArray) this.setModes(eventOptions.modes);
  };

  /**
   * Event Enabled.
   */
  enabled = false;
  /**
   * Event Client.
   */
  _client = true;
  /**
   * Event Process.
   */
  process = false;
  /**
   * Event Once.
   */
  once = false;
  /**
   * Event Database.
   */
  database = false;
  /**
   * Event Language
   */
  language = false;

  /**
   * Webhook of the event
   */
  webhook = null;

  /** 
   * Event Type.
   */
  type = "ChatCommand";
  /**
   * Event Modes.
   */
  modes = [];

  Events = { Discord: Events, Database: Database.Events };

  /**
   * Set the event name.
   * @param {string} name 
   * @returns {string}
   */
  setName(name = null) {
    const nameChecker = new this.checker.BaseChecker(name);
    nameChecker.createError(!nameChecker.isString, "name", { expected: "String", received: nameChecker }).throw();

    this["name"] = name;

    return name;
  };

  /**
   * Change the event's state.
   * @param {boolean} state 
   * @returns {boolean}
   */
  setEnabled(state = true) {
    const stateChecker = new this.checker.BaseChecker(state);
    stateChecker.createError(!stateChecker.isBoolean, "state", { expected: "Boolean", received: stateChecker }).throw();
    
    this["enabled"] = state;

    return state;
  };

  /**
   * Edit the event's modes.
   * @param {string[]} modes 
   * @returns {string[]}
   */
  setModes(modes = []) {
    const modesChecker = new this.checker.BaseChecker(modes);
    modesChecker.createError(!modesChecker.isArray, "modes", { expected: "Array", received: modesChecker }).throw();

    const editedModes = [];

    modes.map((m) => {
      const mode = String(m).trim().toLowerCase();

      if (mode === "once") this["once"] = true;
      if (mode === "process") this["process"] = true;
      if (mode === "database") this["database"] = true;
      if (mode === "language") this["language"] = true;
      if (mode === "client") this["_client"] = true;

      return editedModes.push(mode);
    });

    this["modes"] = editedModes;

    return editedModes;
  };

  /**
   * Change the type of the event.
   * @param {string} type 
   * @returns {string}
   */
  setType(type = "ChatCommand") {
    const typeChecker = new this.checker.BaseChecker(type);
    typeChecker.createError(!typeChecker.isString, "type", { expected: "String", received: typeChecker }).throw();

    this["type"] = type;

    return type;
  };

  /**
   * Change the execute command of the event.
   * @param {Function} callback 
   * @returns {Function}
   */
  setExecute(callback = () => { }) {
    const callbackChecker = new this.checker.BaseChecker(type);
    callbackChecker.createError(!callbackChecker.isFunction, "callback", { expected: "Function", received: callbackChecker }).throw();

    this["execute"] = callback;

    return callback;
  };

  /**
   * Define properties.
   * @param {object[]} propertyData 
   * @returns {number}
   */
  #defineProperty(propertyData = [{ key: "oneUses", value: true }]) {
    const propertyDataChecker = new this.checker.BaseChecker(propertyData);
    propertyDataChecker.createError(!propertyDataChecker.isArray, "propertyData", { expected: "Array", received: propertyDataChecker }).throw();

    propertyData.map((property) => {
      const propertyObject = new Object(property);
      const baseObject = new Object(this);

      if (!propertyObject.hasOwnProperty("key")) return;
      if (!propertyObject.hasOwnProperty("value")) property["value"] = 0;

      if (baseObject.hasOwnProperty(property["key"])) return;

      const key = String(property["key"]).toLowerCase().trim().replaceAll(" ", "_");
      const value = property["value"];

      this[key] = value;

      return this[key];
    });

    return 0;
  };

  /**
   * @param {object[]} propertyData 
   */
  setProperty(propertyData = [{ key: "Enabled", value: null }, { key: "Name", value: null }, { key: "Once", value: false }, { key: "Database", value: false }, { key: "Process", value: false }, { key: "Type", value: "ChatCommand" }, { key: "Webhook", value: null }, { key: "Execute", value: () => { } }]) {
    const propertyDataChecker = new this.checker.BaseChecker(propertyData);
    propertyDataChecker.createError(!propertyDataChecker.isArray, "propertyData", { expected: "Array", received: propertyDataChecker }).throw();

    const properties = [];

    propertyData.map((property) => {
      const propertyObject = new Object(property);
      if (!propertyObject.hasOwnProperty("key") || !propertyObject.hasOwnProperty("value")) return;

      const key = String(property["key"]).trim().toLowerCase();
      const value = property["value"];

      return properties.push({ key, value });
    });

    this.#defineProperty(properties);

    return { getProperty: this.getProperty };
  };

  /**
   * Get the properties.
   * @param {object[]} propertyData 
   */
  getProperty(propertyData = [{ key: "Enabled" }, { key: "Name" }, { key: "Once" }, { key: "Process" }, { key: "Type" }, { key: "Webhook" }, { key: "Database" }, { key: "Execute" }]) {
    const propertyDataChecker = new this.checker.BaseChecker(propertyData);
    propertyDataChecker.createError(!propertyDataChecker.isArray, "propertyData", { expected: "Array", received: propertyDataChecker }).throw();

    const results = [];

    (async () => {
      await Promise.all(propertyData.map((property) => {
        const propertyObject = new Object(property);
        if (!propertyObject.hasOwnProperty("key")) return;

        const key = String(property["key"]).trim().toLowerCase();
        const value = this[key];

        return results.push({ key, value });
      }));
    })();

    const base = this;

    /**
     * Edit the properties.
     * @param {object[]} propertyEditData 
     * @param {boolean} debug
     * @returns {object[]}
     */
    function editProperty(propertyEditData = [{ value: null /* ENABLED */ }, { value: null /* NAME*/ }, { value: false /* ONCE */ }, { value: false /* PROCESS */ }, { value: "ChatCommand" /* TYPE */ }, { value: null /* WEBHOOK DATA */ }, { value: false /* DATABASE */ }, { value: () => { } /* EXECUTE */ }], debug = false) {
      const propertyEditDataChecker = new this.checker.BaseChecker(propertyEditData);
      propertyEditDataChecker.createError(!propertyEditDataChecker.isArray, "propertyEditData", { expected: "Array", received: propertyEditDataChecker }).throw();

      const storage = [];

      (async () => {
        await Promise.all(propertyEditData.map((property, index) => {
          const key = results[index]["key"];

          const oldValue = base[key];
          base[key] = property["value"];
          const newValue = base[key];

          if (debug) console.log(`[Structure#Event?key=${key}] Value changed from '${oldValue}' to '${newValue}'`);

          return storage.push({ key, oldValue, newValue });
        }));
      })();

      return storage;
    };

    return { results, editProperty };
  };

  /**
   * Create a new Discord Webhook.
   * @param {object} options 
   */
  createWebhook(options = { url: null, id: null, token: null }) {
    const optionsChecker = new this.checker.BaseChecker(options);
    optionsChecker.createError(!optionsChecker.isObject, "options", { expected: "Object", received: optionsChecker }).throw();

    const { id, token, url } = options;

    const webhook = new Client({ url, id, token });
    this.webhook = webhook;

    /**
     * Send message with created webhook.
     * @param {object} sendOptions 
     */
    function send(sendOptions = { content: "New Message!", embeds: [], components: [] }) {
      return webhook.send({ content: sendOptions?.content, embeds: sendOptions?.embeds, components: sendOptions?.components });
    };

    return { send };
  };

  /**
   * The command to execute the event.
   */
  async execute() { };

  static version = "v1.0.10";
};