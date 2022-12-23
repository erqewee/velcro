import { Structure as CommandStructure } from "../Structure.js";

export class Command extends CommandStructure {
  constructor(commandOptions = { enabled: true, mode: "Global" }) {
    super();

    const { enabled, mode } = commandOptions;

    this.data = null;

    this.enabled = false;
    this.mode = "Global";
    this.developer = false;

    if (enabled === true) this.setEnabled();
    if (String(mode).toLowerCase().includes("developer")) this.setMode();
  };

  setCommand(data = {}) {
    const object = new Object(data);

    this["data"] = object;

    return object;
  };

  setEnabled(state = true) {
    const object = new Object(this);

    if (object.hasOwnProperty("enabled")) this["enabled"] = state;

    return state;
  };

  setMode(mode = "Developer") {
    const object = new Object(this);

    if (object.hasOwnProperty("mode")) this["mode"] = mode;
    if (object.hasOwnProperty("developer")) this["developer"] = mode === "Global" ? false : true;

    return mode;
  };

  defineProperty(propertyData = [{ key: "newFunction", value: true }]) {
    propertyData.map((property) => {
      const propertyObject = new Object(property);
      const baseObject = new Object(this);

      if (!propertyObject.hasOwnProperty("key")) return;
      if (!propertyObject.hasOwnProperty("value")) property["value"] = 0;

      if (baseObject.hasOwnProperty(property["key"])) return;

      const key = String(property["key"]).toLowerCase().replaceAll(" ", "_");
      const value = property["value"];

      this[key] = value;
    });
  };

  setProperty(propertyData = [{ key: "Enabled", value: null }, { key: "Mode", value: "Global" }, { key: "Command", value: {} }]) {
    propertyData.map((property) => {
      const data = new Object(property);
      if (!data.hasOwnProperty("key") || !data.hasOwnProperty("value")) return;

      const key = String(property["key"]).toLowerCase();
      const value = property["value"];

      this[key] = value;
    });

    return { getProperty: this.getProperty };
  };

  getProperty(propertyData = [{ key: "Enabled" }, { key: "Mode" }, { key: "Command" }]) {
    const results = [];

    (async () => {
      await Promise.all(propertyData.map((property) => {
        const key = String(property["key"]).toLowerCase();
        const value = this[key];

        return results.push({ key, value });
      }));
    })();

    const base = this;

    function editProperty(propertyEditData = [{ value: true /* ENABLED */ }, { value: "Global" /* MODE */ }, { value: {} /* COMMAND DATA */ }], debug = false) {
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