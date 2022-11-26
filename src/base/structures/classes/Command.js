import { Manager } from "../Manager.js";

export class Command extends Manager {
  constructor(options = { enabled: true, support: false, isDev: false }) {
    super();

    this.enabled = options.enabled ?? true;
    this.support = options.support ?? false;
    this.developer = options.isDev ?? false;

    this.data = null;
  };

  setCommand(data) {
    if (data?.toJSON) {
      return this.data = data.toJSON();
    } else if (!data?.toJSON) {
      throw new Error("toJSON() function is not found in one command.")
    }
  };

  setData(data) {
    return this.setCommand(data);
  };

  setEnabled(state) {
    if (typeof state !== "boolean") throw new TypeError("State must be a BOOLEAN!")
    return this.enabled = state;
  };

  setSupport(state) {
    if (typeof state !== "boolean") throw new TypeError("State must be a BOOLEAN!")
    return this.support = state;
  };

  static version = "v1.0.0";
};