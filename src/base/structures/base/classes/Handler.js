import { Event as HandlerStructure } from "./Event.js";

export class Handler extends HandlerStructure {
  constructor(handlerOptions = { name: null, enabled: true, modes: [], type: "ChatCommand" }) {
    super();

    this.name = handlerOptions.name;
    this.type = handlerOptions.type;
    this.modes = handlerOptions?.modes;

    const enabledChecker = new this.checker.BaseChecker(handlerOptions?.enabled);
    const modesChecker = new this.checker.BaseChecker(handlerOptions?.modes);

    if (enabledChecker.isBoolean && handlerOptions.enabled) this.setEnabled();
    if (modesChecker.isArray) this.setModes(...handlerOptions.modes);
  };
};