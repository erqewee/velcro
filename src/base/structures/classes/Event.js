import { WebhookClient as Client, Events } from "discord.js";
import { Manager } from "../Manager.js";

export class Event extends Manager {
  constructor(eventOptions = { name: null, enabled: true, once: false, process: false, type: null }) {
    super();

    this.name = eventOptions.name ?? null;
    this.enabled = eventOptions.enabled ?? true;
    this.once = eventOptions.once ?? false;
    this.process = eventOptions.process ?? false;
    this.type = eventOptions.type ?? null;

    this.events = Events;
    this.webhook = null;
  };

  setName(name) {
    return this.name = name;
  };

  setEnabled(state) {
    if (typeof state !== "boolean") throw new TypeError("State must be a BOOLEAN!")
    return this.enabled = state;
  };

  setOnce(state) {
    if (typeof state !== "boolean") throw new TypeError("State must be a BOOLEAN!")
    return this.once = state;
  };

  setProcess(state) {
    if (typeof state !== "boolean") throw new TypeError("State must be a BOOLEAN!")
    return this.process = state;
  };

  setWebhook(options = { URL: null, ID: null, TOKEN: null }) {
    return this.webhook = new Client({ id: options.ID ?? null, token: options.TOKEN ?? null, url: options.URL ?? null });
  };

  setType(type) {
    if (typeof type !== "boolean") throw new TypeError("Type must be a BOOLEAN!")
    return this.type = type;
  };

  sendWebhook(options = { content: "", embeds: [], components: [] }) {
    const { embeds, content, components } = options;

    return this.webhook ? this.webhook.send({ content, embeds, components }) : null;
  };

  static version = "v1.0.0";
};