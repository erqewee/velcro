import { WebhookClient as Client, Events } from "discord.js";
import { Structure as EventStructure } from "../Structure.js";

import { Database } from "../../../classes/Database.js";

export class Event extends EventStructure {
  constructor(eventOptions = { name: null, enabled: true, once: false, process: false, type: "ChatCommand", database: false }) {
    super();

    this.name = eventOptions.name;
    this.enabled = eventOptions.enabled;
    this.once = eventOptions.once;
    this.process = eventOptions.process;
    this.type = eventOptions.type;
    this.database = eventOptions.database;

    this.Events = { Discord: Events, Database: Database.Events };

    this.webhook = null;
  };

  setName(name = null) {
    this.name = name;
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

  setType(type = "ChatCommand") {
    const object = new Object(this);

    if (object.hasOwnProperty("type")) this["type"] = type;

    return type;
  };

  // setProperty is an experimental feature.
  setProperty(propertyOptions = { key: "Enabled" || "Name" || "Once" || "Process" || "Type" || "Webhook", value: null }) {
    const { key, value } = propertyOptions;
    const propertyKey = key.toLowerCase();
    let propertyType = "Boolean";
    const propertyValue = value;

    if (typeof propertyValue === "boolean") propertyType = "Boolean";
    else if (typeof propertyValue === "string") propertyType = "String";
    else if (typeof propertyValue === "object") propertyType = "Object";
    else if (typeof propertyValue === "undefined" || propertyValue === null) propertyType = null;

    if (propertyKey === "enabled" && propertyValue && propertyType === "Boolean") this[propertyKey] = value;
    else if (propertyKey === "name" && propertyValue && propertyType === "String") this[propertyKey] = value;
    else if (propertyKey === "once" && propertyValue && propertyType === "Boolean") this[propertyKey] = value;
    else if (propertyKey === "process" && propertyValue && propertyType === "Boolean") this[propertyKey] = value;
    else if (propertyKey === "type" && propertyValue && propertyType === "String") this[propertyKey] = value;
    else if (propertyKey === "webhook" && propertyValue && propertyType === "Object") {
      const propertyValueOutput = new Object(propertyValue);

      if (propertyValueOutput.hasOwnProperty("url")) {
        const webhook = new Client({ url: propertyValueOutput.url });

        if (propertyValueOutput.hasOwnProperty("message")) {
          const value = new Object(propertyValueOutput.message);

          if (value.hasOwnProperty("embeds") || value.hasOwnProperty("components") || value.hasOwnProperty("content")) webhook.send({ content: value?.content, embeds: value?.embeds, components: value?.components });
        };
      } else if (propertyValueOutput.hasOwnProperty("id") && propertyValueOutput.hasOwnProperty("token")) {
        const webhook = new Client({ id: propertyValueOutput.id, token: propertyValueOutput.token });

        if (propertyValueOutput.hasOwnProperty("message")) {
          const value = new Object(propertyValueOutput.message);

          if (value.hasOwnProperty("embeds") || value.hasOwnProperty("components") || value.hasOwnProperty("content")) webhook.send({ content: value?.content, embeds: value?.embeds, components: value?.components });
        };
      };
    };

    return { propertyKey, propertyValue, propertyType };
  };

  // setProperties is an experimental feature.
  setProperties(propertyOptions = { keys: ["Enabled", "Name", "Once", "Process", "Type", "Webhook"], values: [true, null, false, false, null, null] }) {
    const { keys, values } = propertyOptions;

    return keys.map((key, index) => {
      const value = values[index];

      const propertyKey = key.toLowerCase();
      let propertyType = "Boolean";
      const propertyValue = value;

      this.setProperty({ key: propertyKey, value });

      return { propertyKey, propertyType, propertyValue };
    });
  };

  // getProperty is an experimental feature.
  getProperty(propertyOptions = { key: "Enabled" || "Name" || "Once" || "Process" || "Type" || "Webhook" }) {
    const { key } = propertyOptions;
    const propertyKey = key.toLowerCase();

    let result = null;

    const object = new Object(this);

    if (propertyKey === "enabled" && object.hasOwnProperty("enabled")) result = this[propertyKey];
    else if (propertyKey === "type" && object.hasOwnProperty("type")) result = this[propertyKey];
    else if (propertyKey === "name" && object.hasOwnProperty("name")) result = this[propertyKey];
    else if (propertyKey === "once" && object.hasOwnProperty("once")) result = this[propertyKey];
    else if (propertyKey === "process" && object.hasOwnProperty("process")) result = this[propertyKey];
    else if (propertyKey === "webhook" && object.hasOwnProperty("webhook")) result = this[propertyKey];

    return { result, propertyKey, object };
  };

  // getProperties is an experimental feature.
  getProperties(propertyOptions = { keys: ["Enabled", "Mode", "Command"] }) {
    const { keys } = propertyOptions;

    const result = [];

    keys.map((key) => {
      const property = this.getProperty({ key });

      return result.push({ name: property.name, object: property.object, key: property.propertyKey });
    });

    return { result, keys, setProperties: this.setProperties };
  };

  async execute() { };

  static version = "v1.0.0";
};