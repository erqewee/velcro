import { Structure as CommandStructure } from "../Structure.js";

export class Command extends CommandStructure {
  constructor(commandOptions = { enabled: true, mode: "Global" }) {
    super();

    this.data = null;

    this.enabled = commandOptions.enabled;
    this.mode = commandOptions.mode;
    this.developer = String(commandOptions.mode).toLowerCase() === "developer" ? true : false;
  };

  setCommand(data = {}) {
    const object = new Object(data);

    this.data = object;

    return object;
  };

  setEnabled(state = true) {
    const object = new Object(this);

    if (object.hasOwnProperty("enabled")) this["enabled"] = state;

    return state;
  };

  setMode(mode = "Global" || "Developer") {
    const object = new Object(this);

    if (object.hasOwnProperty("mode")) this["mode"] = mode;
    if (object.hasOwnProperty("developer")) this["developer"] = mode === "Global" ? false : true;

    return mode;
  };

  setProperty(propertyData = [{ key: "Enabled", value: null }, { key: "Mode", value: "Global" }, { key: "Command", value: {} }]) {
    propertyData.map((property) => {
      const key = String(property.key).toLowerCase();
      const value = property.value;

      this[key] = value;
    });

    return { getProperty: this.getProperty };
  };

  getProperty(propertyData = [{ key: "Enabled" }, { key: "Mode" }, { key: "Command" }]) {
    const results = [];

    (async () => {
      await Promise.all(propertyData.map((property) => {
        const key = String(property.key).toLowerCase();
        const value = this[key];

        return results.push({ key, value });
      }));
    })();

    const thisdefault = this;

    function editProperty(propertyEditData = [{ value: true /* ENABLED */}, { value: "Global" /* MODE */}, { value: {} /* COMMAND DATA */}], debug = false) {
      propertyEditData.map((property, index) => {
        const key = results[index].key;

        const oldValue = thisdefault[key];
        thisdefault[key] = property.value;
        const newValue = thisdefault[key];

        if (debug) console.log(`[Structure#Command?key=${key}] Value changed from '${oldValue}' to '${newValue}'`);
      });
    };

    return { results, editProperty };
  };

  async execute() { };

  static version = "v1.0.0";
};