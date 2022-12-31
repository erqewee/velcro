import { Structure as CommandStructure } from "../Structure.js";

export class Command extends CommandStructure {
  constructor(commandOptions = { enabled: true, mode: "Global" }) {
    super();

    const { enabled, mode } = commandOptions;

    if (this.checker.check(enabled).isBoolean() && enabled === true) this.setEnabled();
    if (this.checker.check(mode).isString() && mode.toLowerCase() === "developer") this.setMode();
  };

  data = {};

  enabled = false;
  mode = "Global";
  developer = false;

  setCommand(commandData = {}) {
    if (!this.checker.check(commandData).isObject()) this.checker.error("commandData", "InvalidType", { expected: "Object", received: (typeof commandData) });

    const object = new Object(commandData);

    this["data"] = object;

    return object;
  };

  setEnabled(state = true) {
    if (!this.checker.check(state).isBoolean()) this.checker.error("state", "InvalidType", { expected: "Boolean", received: (typeof state) });

    this["enabled"] = state;

    return state;
  };

  setExecute(callback = () => { }) {
    if (!this.checker.check(callback).isFunction()) this.checker.error("callback", "InvalidType", { expected: "Function", received: (typeof callback) });

    this["execute"] = callback;

    return callback;
  };

  setMode(mode = "Developer") {
    if (!this.checker.check(mode).isString()) this.checker.error("mode", "InvalidType", { expected: "String", received: (typeof mode) });

    const m = String(mode).trim().toLowerCase();

    this["mode"] = m;
    this["developer"] = m.includes("developer") ? true : false;

    return mode;
  };

  #defineProperty(propertyData = [{ key: "newFunction", value: true }]) {
    if (!this.checker.check(propertyData).isArray()) this.checker.error("propertyData", "InvalidType", { expected: "Array", received: (typeof propertyData) });

    propertyData.map((property) => {
      const propertyObject = new Object(property);

      if (!propertyObject.hasOwnProperty("key")) return;
      if (!propertyObject.hasOwnProperty("value")) property["value"] = 0;

      if (this[property["key"]]) return;

      const key = String(property["key"]).trim().toLowerCase().replaceAll(" ", "_");
      const value = property["value"];

      this[key] = value;
    });
  };

  setProperty(propertyData = [{ key: "Enabled", value: null }, { key: "Mode", value: "Global" }, { key: "Command", value: {} }, { key: "Execute", value: () => { } }]) {
    if (!this.checker.check(propertyData).isArray()) this.checker.error("propertyData", "InvalidType", { expected: "Array", received: (typeof propertyData) });

    propertyData.map((property) => {
      const data = new Object(property);
      if (!data.hasOwnProperty("key") || !data.hasOwnProperty("value")) return;

      const key = String(property["key"]).trim().toLowerCase();
      const value = property["value"];

      this.#defineProperty([{ key, value }]);
    });

    return { getProperty: this.getProperty };
  };

  getProperty(propertyData = [{ key: "Enabled" }, { key: "Mode" }, { key: "Command" }, { key: "Execute" }]) {
    if (!this.checker.check(propertyData).isArray()) this.checker.error("propertyData", "InvalidType", { expected: "Array", received: (typeof propertyData) });

    const results = [];

    (async () => {
      await Promise.all(propertyData.map((property) => {
        const key = String(property["key"]).trim().toLowerCase();
        const value = this[key];

        return results.push({ key, value });
      }));
    })();

    const base = this;

    function editProperty(propertyEditData = [{ value: true /* ENABLED */ }, { value: "Global" /* MODE */ }, { value: {} /* COMMAND DATA */ }, { value: () => { } /* EXECUTE */ }], debug = false) {
      if (!base.checker.check(propertyEditData).isArray()) base.checker.error("propertyEditData", "InvalidType", { expected: "Array", received: (typeof propertyEditData) });

      propertyEditData.map((property, index) => {
        const key = results[index]["key"];

        const oldValue = base[key];
        base[key] = property["value"];
        const newValue = base[key];

        if (debug) console.log(`[Structure#Command?key=${key}] Value changed from '${oldValue}' to '${newValue}'`);
      });
    };

    return { results, editProperty };
  };

  async execute() { };

  static version = "v1.0.0";
};