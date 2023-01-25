import { Structure as CommandStructure } from "../Structure.js";

export class Command extends CommandStructure {
  constructor(commandOptions = { enabled: true, mode: "Global" }) {
    super();

    const { enabled, mode } = commandOptions;

    const enabledChecker = new this.checker.BaseChecker(enabled);
    const modeChecker = new this.checker.BaseChecker(mode);

    if (enabledChecker.isBoolean && enabled === true) this.setEnabled();
    if (modeChecker.isString && mode.toLowerCase() === "developer") this.setMode();
  };

  /**
   * Command Data
   */
  data = {};

  /**
   * Command Enabled.
   */
  enabled = false;
  /**
   * Command Mode.
   */
  mode = "Global";
  /**
   * Command Developer Mode.
   */
  developer = false;

  /**
   * Converts the string to a readable object.
   * @param {object|string} data 
   * @returns {object}
   */
  toJSON(data = new this.SlashCommand()) {
    const Command = this.Command;

    if (!(data instanceof Command)) throw new Error("UNEXPECTED_BUILDER", "This builder is not a 'SlashCommand'");

    const object = new Object(data);

    return object;
  };

  /**
   * Set the command.
   * @param {object|string} commandData 
   * @returns {object}
   */
  setCommand(commandData = {}) {
    const json = this.toJSON(commandData);

    this["data"] = json;

    return json;
  };

  /**
   * Change the command's state.
   * @param {boolean} state 
   * @returns {boolean}
   */
  setEnabled(state = true) {
    const stateChecker = new this.checker.BaseChecker(state);
    stateChecker.createError(!stateChecker.isBoolean, "state", { expected: "Boolean", received: stateChecker }).throw();

    this["enabled"] = state;

    return state;
  };

  /**
   * Set the command's execution command.
   * @param {Function} callback 
   * @returns {Function}
   */
  setExecute(callback = () => { }) {
    const callbackChecker = new this.checker.BaseChecker(callback);
    callbackChecker.createError(!callbackChecker.isFunction, "callback", { expected: "Function", received: callbackChecker }).throw();

    this["execute"] = callback;

    return callback;
  };

  /**
   * Set the mode of the command.
   * @param {string} mode 
   * @returns {string}
   */
  setMode(mode = "Developer") {
    const modeChecker = new this.checker.BaseChecker(mode);
    modeChecker.createError(!modeChecker.isString, "mode", { expected: "String", received: modeChecker }).throw();

    const m = String(mode).trim().toLowerCase();

    this["mode"] = m;
    this["developer"] = m.includes("developer") ? true : false;

    return mode;
  };

  /**
   * Define properties.
   * @param {object[]} propertyData 
   * @returns {number}
   */
  #defineProperty(propertyData = [{ key: "newFunction", value: true }]) {
    const propertyDataChecker = new this.checker.BaseChecker(propertyData);
    propertyDataChecker.createError(!propertyDataChecker.isArray, "propertyData", { expected: "Array", received: propertyDataChecker }).throw();

    propertyData.map((property) => {
      const propertyObject = new Object(property);

      if (!propertyObject.hasOwnProperty("key")) return;
      if (!propertyObject.hasOwnProperty("value")) property["value"] = 0;

      if (this[property["key"]]) return;

      const key = String(property["key"]).trim().toLowerCase().replaceAll(" ", "_");
      const value = property["value"];

      this[key] = value;

      return this[key];
    });

    return 0;
  };

  /**
   * @param {object[]} propertyData 
   */
  setProperty(propertyData = [{ key: "Enabled", value: null }, { key: "Mode", value: "Global" }, { key: "Command", value: {} }, { key: "Execute", value: () => { } }]) {
    const propertyDataChecker = new this.checker.BaseChecker(propertyData);
    propertyDataChecker.createError(!propertyDataChecker.isArray, "propertyData", { expected: "Array", received: propertyDataChecker }).throw();

    const properties = [];

    propertyData.map((property) => {
      const data = new Object(property);
      if (!data.hasOwnProperty("key") || !data.hasOwnProperty("value")) return;

      const key = String(property["key"]).trim().toLowerCase();
      const value = property["value"];

      return properties.push({ key, value });
    });

    this.#defineProperty(properties);

    return { getProperty: this.getProperty };
  };

  /**
   * Get the properties.
   * @param {object[]} propertyData 
   */
  getProperty(propertyData = [{ key: "Enabled" }, { key: "Mode" }, { key: "Command" }, { key: "Execute" }]) {
    const propertyDataChecker = new this.checker.BaseChecker(propertyData);
    propertyDataChecker.createError(!propertyDataChecker.isArray, "propertyData", { expected: "Array", received: propertyDataChecker }).throw();

    const results = [];

    (async () => {
      await Promise.all(propertyData.map((property) => {
        const key = String(property["key"]).trim().toLowerCase();
        const value = this[key];

        return results.push({ key, value });
      }));
    })();

    const base = this;

    /**
     * Edit the properties.
     * @param {object[]} propertyEditData 
     * @param {boolean} debug 
     */
    function editProperty(propertyEditData = [{ value: true /* ENABLED */ }, { value: "Global" /* MODE */ }, { value: {} /* COMMAND DATA */ }, { value: () => { } /* EXECUTE */ }], debug = false) {
      const propertyEditDataChecker = new this.checker.BaseChecker(propertyEditData);
      propertyEditDataChecker.createError(!propertyEditDataChecker.isArray, "propertyEditData", { expected: "Array", received: propertyEditDataChecker }).throw();

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

  /**
   * The command to execute the command.
   */
  async execute() { };

  static version = "v1.0.0";
};