import { Event as HandlerStructure } from "./Event.js";

export class Handler extends HandlerStructure {
  constructor(handlerOptions = { name: null, enabled: true, modes: [null], type: "ChatCommand" }) {
    super();

    this.name = handlerOptions.name;
    this.type = handlerOptions.type;
    this.modes = handlerOptions?.modes;

    this.enabled = false;
    this.process = false;
    this.once = false;

    if (handlerOptions?.enabled === true) this.setEnabled();

    if (handlerOptions?.modes) {
      handlerOptions.modes.map((m) => {
        const mode = String(m).trim().toLowerCase();

        if (mode.includes("once")) this.setOnce();
        else if (mode.includes("process")) this.setProcess();
        else if (mode.includes("database")) this.setDatabase();
        else if (mode.includes("language")) this.setLanguage();

        return handlerOptions.modes.push(mode);
      });
    };
  };
};