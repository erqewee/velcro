import { WebhookClient as Client, Events } from "discord.js";
import { Structure as EventStructure } from "../Structure.js";

import { Database } from "../../../classes/Database/Database.js";

export class Event extends EventStructure {
  constructor(eventOptions = { name: null, enabled: true, modes: [null], type: "ChatCommand" }) {
    super();

    this.name = eventOptions.name;
    this.enabled = eventOptions.enabled;
    this.type = eventOptions.type;
    this.modes = eventOptions.modes;
    
    this.once = false;
    this.process = false;
    this.database = false;

    eventOptions.modes?.map((m) => {
      const mode = String(m).toLowerCase();

      if (mode.includes("once")) this.setOnce();
      else if (mode.includes("process")) this.setProcess();
      else if (mode.includes("database")) this.setDatabase();

      return eventOptions.modes.push(mode);
    });

    this.Events = { Discord: Events, Database: Database.Events };

    this.webhook = null;
  };

  setName(name = null) {
    const object = new Object(this);

    if (object.hasOwnProperty("name")) this["name"] = name;

    return name;
  };

  setEnabled(state = true) {
    const object = new Object(this);

    if (object.hasOwnProperty("enabled")) this["enabled"] = state;

    return state;
  };

  setOnce(state = true) {
    const object = new Object(this);

    if (object.hasOwnProperty("once")) this["once"] = state;

    return state;
  };

  setProcess(state = true) {
    const object = new Object(this);

    if (object.hasOwnProperty("process")) this["process"] = state;

    return state;
  };

  setDatabase(state = true) {
    const object = new Object(this);

    if (object.hasOwnProperty("database")) this["database"] = state;

    return state;
  };

  setType(type = "ChatCommand") {
    const object = new Object(this);

    if (object.hasOwnProperty("type")) this["type"] = type;

    return type;
  };

  setProperty(propertyData = [{ key: "Enabled", value: null }, { key: "Name", value: null }, { key: "Once", value: false }, { key: "Database", value: false }, { key: "Process", value: false }, { key: "Type", value: "ChatCommand" }, { key: "Webhook", value: null }]) {
    propertyData.map((property) => {
      const propertyObject = new Object(property);
      if (!propertyObject.hasOwnProperty("key") || !propertyObject.hasOwnProperty("value")) return;

      const key = String(property.key).toLowerCase();
      const value = property.value;

      this[key] = value;
    });

    return { getProperty: this.getProperty };
  };

  getProperty(propertyData = [{ key: "Enabled" }, { key: "Name" }, { key: "Once" }, { key: "Process" }, { key: "Type" }, { key: "Webhook" }, { key: "Database" }]) {
    const results = [];

    (async () => {
      await Promise.all(propertyData.map((property) => {
        const propertyObject = new Object(property);
        if (!propertyObject.hasOwnProperty("key")) return;

        const key = String(property.key).toLowerCase();
        const value = this[key];

        return results.push({ key, value });
      }));
    })();

    const thisdefault = this;

    function editProperty(propertyEditData = [{ value: null /* ENABLED */ }, { value: null /* NAME*/ }, { value: false /* ONCE */ }, { value: false /* PROCESS */ }, { value: "ChatCommand" /* TYPE */ }, { value: null /* WEBHOOK DATA */ }, { value: false /* DATABASE */ }], debug = false) {
      propertyEditData.map((property, index) => {
        const key = results[index].key;

        const oldValue = thisdefault[key];
        thisdefault[key] = property.value;
        const newValue = thisdefault[key];

        if (debug) console.log(`[Structure#Event?key=${key}] Value changed from '${oldValue}' to '${newValue}'`);
      });
    };

    return { results, editProperty };
  };

  createWebhook(options = { url: null, id: null, token: null }) {
    const { id, token, url } = options;

    const webhook = new Client({ url, id, token });

    function send(sendOptions = { content: "New Message!", embeds: [], components: [] }) {
      return webhook.send({ content: sendOptions?.content, embeds: sendOptions?.embeds, components: sendOptions?.components });
    };

    return { send };
  };

  async execute() { };

  static version = "v1.0.0";
};