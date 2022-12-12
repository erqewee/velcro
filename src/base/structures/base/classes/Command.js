import { Structure as CommandStructure } from "../Structure.js";

export class Command extends CommandStructure {
  constructor(commandOptions = { enabled: true, mode: "Global" }) {
    super();

    this.data = null;

    this.enabled = commandOptions.enabled;
    this.mode = commandOptions.mode;
    this.developer = commandOptions.mode === "Developer" ? true : false;
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

  // setProperty is an experimental feature.
  setProperty(propertyOptions = { key: "Enabled" || "Mode" || "Command", value: null }) {
    const { key, value } = propertyOptions;
    const propertyKey = key.toLowerCase();
    let propertyType = "Boolean";
    const propertyValue = value;

    if (typeof propertyValue === "boolean") propertyType = "Boolean";
    else if (typeof propertyValue === "string") propertyType = "String";
    else if (typeof propertyValue === "object") propertyType = "Object";
    else if (typeof propertyValue === "undefined" || propertyValue === null) propertyType = null;

    if (propertyKey === "enabled" && propertyValue && propertyType === "Boolean") this[propertyKey] = value;
    else if (propertyKey === "mode" && propertyValue && propertyType === "String") this[propertyKey] = value;
    else if (propertyKey === "command" && propertyValue && propertyType === "Object") {
      const object = new Object(propertyValue);

      this["data"] = object;

      return object;
    };

    return { propertyName, propertyType, propertyValue, getProperty: this.getProperty };
  };

  // setProperties is an experimental feature.
  setProperties(propertyOptions = { keys: ["Enabled", "Mode", "Command"], values: [true, "Global", {}] }) {
    const { keys, values } = propertyOptions;

    keys.map((key, index) => {
      const value = values[index];

      const propertyKey = key.toLowerCase();
      let propertyType = "Boolean";
      const propertyValue = value;

      if (typeof propertyValue === "boolean") propertyType = "Boolean";
      else if (typeof propertyValue === "string") propertyType = "String";
      else if (typeof propertyValue === "object") propertyType = "Object";
      else if (typeof propertyValue === "undefined" || propertyValue === null) propertyType = null;

      this.setProperty({ key: propertyKey, value });

      return { propertyKey, propertyType, propertyValue };
    });

    return { keys, values };
  };

  // getProperty is an experimental feature.
  getProperty(propertyOptions = { key: "Enabled" || "Mode" || "Command" }) {
    const { key } = propertyOptions;
    const propertyKey = key.toLowerCase();

    let result = null;

    const object = new Object(this);

    if (propertyKey === "enabled" && object.hasOwnProperty("enabled")) result = this[propertyKey];
    else if (propertyKey === "mode" && object.hasOwnProperty("mode")) result = this[propertyKey];
    else if (propertyKey === "command" && object.hasOwnProperty("data")) result = this["data"];

    return { result, propertyKey, object };
  };

  // getProperties is an experimental feature.
  getProperties(propertyOptions = { keys: ["Enabled", "Mode", "Command"] }) {
    const { keys } = propertyOptions;

    const result = [];

    keys.map((key) => {
      const property = this.getProperty({ key });

      return result.push({ name: property.name, object: property.object, key: property.propertyKey, result: property.result });
    });

    return { result, keys, setProperties: this.setProperties };
  };

  async execute() { };

  static version = "v1.0.0";
};