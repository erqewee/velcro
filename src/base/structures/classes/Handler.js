import { Event } from "./Event.js";

export class Handler extends Event {
  constructor(handlerOptions = { name: null, enabled: true, once: false, process: false, type: null }) {
    super({
      once: handlerOptions.once,
      process: handlerOptions.process,
      type: handlerOptions.type
    });

    this.name = handlerOptions.name;
    this.enabled = handlerOptions.enabled;
  };

  version = "v1.0.0";
};