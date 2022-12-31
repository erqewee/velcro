import { Event as HandlerStructure } from "./Event.js";

export class Handler extends HandlerStructure {
  constructor(handlerOptions = { name: null, enabled: true, modes: [], type: "ChatCommand" }) {
    super();

    this.name = handlerOptions.name;
    this.type = handlerOptions.type;
    this.modes = handlerOptions?.modes;

    if (this.checker.check(handlerOptions?.enabled).isBoolean() && handlerOptions.enabled === true) this.setEnabled();
    if (this.checker.check(handlerOptions?.modes).isArray()) {
      const modes = [];

      handlerOptions.modes.map((m) => {
        const mode = String(m).trim().toLowerCase();

        if (mode.includes("once")) this.setOnce();
        else if (mode.includes("process")) this.setProcess();
        else if (mode.includes("database")) this.setDatabase();
        else if (mode.includes("language")) this.setLanguage();

        return modes.push(mode);
      });

      handlerOptions.modes = modes;
    };
  };

  enabled = false;
  process = false;
  once = false;
};