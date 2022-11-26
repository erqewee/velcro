import { Event } from "./Event.js";

export class Handler extends Event {
  constructor(handlerOptions = { name: null, enabled: true, once: false, process: false, type: null }) {
    super({
      once: handlerOptions.once ?? false,
      process: handlerOptions.process ?? false,
      type: handlerOptions.type ?? null
    });

    this.name = handlerOptions.name ?? null;
    this.enabled = handlerOptions.enabled ?? true;
  };

  version = "v1.0.0";
};