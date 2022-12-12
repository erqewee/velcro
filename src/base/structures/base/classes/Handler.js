import { Event as HandlerStructure } from "./Event.js";

export class Handler extends HandlerStructure {
  constructor(handlerOptions = { name: null, enabled: true, once: false, process: false, type: "ChatCommand" }) {
    super();

    this.once = handlerOptions.once;
    this.process = handlerOptions.process;
    this.type = handlerOptions.type;
    this.name = handlerOptions.name;
    this.enabled = handlerOptions.enabled;
  };

  version = "v1.0.0";
};