import { WebhookClient as Client, Events } from "discord.js";
import { Structure as EventStructure } from "../Structure.js";

import { Database } from "../../../classes/Database/Database.js";

export class Event extends EventStructure {
  constructor(eventOptions = { name: null, enabled: true, modes: [], type: "ChatCommand" }) {
    super();

    this.name = eventOptions.name;
    this.type = eventOptions.type;
    this.modes = eventOptions?.modes;

    if (this.checker.check(eventOptions?.enabled).isBoolean() && eventOptions.enabled === true) this.setEnabled();
    if (this.checker.check(eventOptions?.modes).isArray()) this.setModes(eventOptions.modes);
  };

  enabled = false;
  _client = true;
  process = false;
  once = false;
  database = false;
  language = false;

  webhook = null;

  Events = { Discord: Events, Database: Database.Events };

  setName(name = null) {
    if (!this.checker.check(name).isString()) this.checker.error("name", "InvalidType", { expected: "String", received: (typeof name) });

    this["name"] = name;

    return name;
  };

  setEnabled(state = true) {
    if (!this.checker.check(state).isBoolean()) this.checker.error("state", "InvalidType", { expected: "Boolean", received: (typeof state) });

    this["enabled"] = state;

    return state;
  };

  setModes(modes = []) {
    if (!this.checker.check(modes).isArray()) this.checker.error("modes", "InvalidType", { expected: "Array", received: (typeof modes) });

    this["modes"] = modes;

    modes.map((m) => {
      const mode = String(m).trim().toLowerCase();

      if (mode === "once") this["once"] = true;
      if (mode === "process") this["process"] = true;
      if (mode === "database") this["database"] = true;
      if (mode === "language") this["language"] = true;
      if (mode === "client") this["_client"] = true;

      return mode;
    });

    return modes;
  };

  setType(type = "ChatCommand") {
    if (!this.checker.check(type).isString()) this.checker.error("type", "InvalidType", { expected: "String", received: (typeof type) });

    this["type"] = type;

    return type;
  };

  setExecute(callback = () => { }) {
    if (!this.checker.check(callback).isFunction()) this.checker.error("callback", "InvalidType", { expected: "Function", received: (typeof callback) });

    this["execute"] = callback;

    return callback;
  };

  #defineProperty(propertyData = [{ key: "oneUses", value: true }]) {
    if (!this.checker.check(propertyData).isArray()) this.checker.error("propertyData", "InvalidType", { expected: "Array", received: (typeof propertyData) });

    propertyData.map((property) => {
      const propertyObject = new Object(property);
      const baseObject = new Object(this);

      if (!propertyObject.hasOwnProperty("key")) return;
      if (!propertyObject.hasOwnProperty("value")) property["value"] = 0;

      if (baseObject.hasOwnProperty(property["key"])) return;

      const key = String(property["key"]).toLowerCase().trim().replaceAll(" ", "_");
      const value = property["value"];

      this[key] = value;
    });
  };

  setProperty(propertyData = [{ key: "Enabled", value: null }, { key: "Name", value: null }, { key: "Once", value: false }, { key: "Database", value: false }, { key: "Process", value: false }, { key: "Type", value: "ChatCommand" }, { key: "Webhook", value: null }, { key: "Execute", value: () => { } }]) {
    if (!this.checker.check(propertyData).isArray()) this.checker.error("propertyData", "InvalidType", { expected: "Array", received: (typeof propertyData) });

    propertyData.map((property) => {
      const propertyObject = new Object(property);
      if (!propertyObject.hasOwnProperty("key") || !propertyObject.hasOwnProperty("value")) return;

      const key = String(property["key"]).trim().toLowerCase();
      const value = property["value"];

      this.#defineProperty([{ key, value }]);
    });

    return { getProperty: this.getProperty };
  };

  getProperty(propertyData = [{ key: "Enabled" }, { key: "Name" }, { key: "Once" }, { key: "Process" }, { key: "Type" }, { key: "Webhook" }, { key: "Database" }, { key: "Execute" }]) {
    if (!this.checker.check(propertyData).isArray()) this.checker.error("propertyData", "InvalidType", { expected: "Array", received: (typeof propertyData) });

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

    function editProperty(propertyEditData = [{ value: null /* ENABLED */ }, { value: null /* NAME*/ }, { value: false /* ONCE */ }, { value: false /* PROCESS */ }, { value: "ChatCommand" /* TYPE */ }, { value: null /* WEBHOOK DATA */ }, { value: false /* DATABASE */ }, { value: () => { } /* EXECUTE */ }], debug = false) {
      if (!this.checker.check(propertyEditData).isArray()) this.checker.error("propertyEditData", "InvalidType", { expected: "Array", received: (typeof propertyEditData) });

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

  createWebhook(options = { url: null, id: null, token: null }) {
    if (!this.checker.check(options).isObject()) this.checker.error("options", "InvalidType", { expected: "Object", received: (typeof options) });

    const { id, token, url } = options;

    const webhook = new Client({ url, id, token });
    this.webhook = webhook;

    function send(sendOptions = { content: "New Message!", embeds: [], components: [] }) {
      return webhook.send({ content: sendOptions?.content, embeds: sendOptions?.embeds, components: sendOptions?.components });
    };

    return { send };
  };

  async execute() { };

  static version = "v1.0.10";
};