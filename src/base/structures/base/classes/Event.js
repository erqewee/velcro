import { WebhookClient as Client, Events } from "discord.js";
import { Structure as EventStructure } from "../Structure.js";

import { Database } from "../../../classes/Database/Database.js";

export class Event extends EventStructure {
  constructor(eventOptions = { name: null, enabled: true, modes: [], type: "ChatCommand" }) {
    super();

    this.name = eventOptions.name;
    this.type = eventOptions.type;
    this.modes = eventOptions?.modes;

    const enabledChecker = new this.checker.BaseChecker(eventOptions?.enabled);
    const modesChecker = new this.checker.BaseChecker(eventOptions?.modes);

    if (enabledChecker.isBoolean && eventOptions.enabled) this.setEnabled();
    if (modesChecker.isArray) this.setModes(...eventOptions.modes);
  };

  /**
   * Event Enabled.
   */
  enabled = false;

  /**
   * Event Client.
   */
  _client = true;

  /**
   * Event Process.
   */
  process = false;

  /**
   * Event Once.
   */
  once = false;

  /**
   * Event Database.
   */
  database = false;

  /**
   * Event Language
   */
  language = false;

  /**
   * Webhook of the event
   */
  webhook = null;

  /** 
   * Event Type.
   */
  type = "ChatCommand";

  /**
   * Event Modes.
   */
  modes = [];

  Events = { Discord: Events, Database: Database.Events };

  /**
   * Set the event name.
   * @param {string} name 
   * @returns {string}
   */
  setName(name = null) {
    const nameError = new this.checker.BaseChecker(name).Error;
    nameError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'name'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    this.name = name;

    return this;
  };

  /**
   * Change the event's state.
   * @param {boolean} state 
   * @returns {boolean}
   */
  setEnabled(state = true) {
    const stateError = new this.checker.BaseChecker(state).Error;
    stateError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'state'.")
      .setCondition("isNotBoolean")
      .setType("InvalidType")
      .throw();

    this.enabled = state;

    return this;
  };

  /**
   * Edit the event's modes.
   * @param {string[]} modes 
   * @returns {string[]}
   */
  setModes(...modes) {
    const modesError = new this.checker.BaseChecker(modes).Error;
    modesError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'modes'.")
      .setCondition("isNotArray")
      .setType("InvalidType")
      .throw();

    const availableModes = [ "once", "process", "database", "language", "client" ];

    const settedModes = [];

    for (let index = 0; index < modes.length; index++) {
      let mode = modes[ index ].toLowerCase();

      if (availableModes.includes(mode)) {
        if (mode === "client") mode = "_client";

        let state = this[ mode ];
        if (state) this[ mode ] = false;
        else this[ mode ] = true;
      } else return console.log(`Error[Structure[${this.constructor.name}[Modes[${mode}]]]]: An invalid mode was provided.`);

      settedModes.push({ mode, enabled: this[ mode ] });
    };

    this.modes = settedModes;
    
    return this;
  };

  /**
   * Change the type of the event.
   * @param {string} type 
   * @returns {string}
   */
  setType(type = "ChatCommand") {
    const typeError = new this.checker.BaseChecker(type).Error;
    typeError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'type'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    this.type = type;

    return this;
  };

  /**
   * Change the execute command of the event.
   * @param {Function} callback 
   * @returns {Function}
   */
  setExecute(callback = () => { }) {
    const callbackError = new this.checker.BaseChecker(callback).Error;
    callbackError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'callback'.")
      .setCondition("isNotFunction")
      .setType("InvalidType")
      .throw();

    this.execute = callback;

    return this;
  };

  /**
   * Define properties.
   * @param {{ key: string, value?: any }[]} propertyData 
   * @returns {number}
   */
  #defineProperty(...propertyData) {
    const propertyDataError = new this.checker.BaseChecker(propertyData).Error;
    propertyDataError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'propertyData'.")
      .setCondition("isNotArray")
      .setType("InvalidType")
      .throw();

    let processed = 0;

    for (let index = 0; index < propertyData.length; index++) {
      const property = propertyData[ index ];

      if (!property?.key) return;

      const key = property.key.toLowerCase().replaceAll(" ", "_");

      if (this[ key ]) return;

      this[ key ] = property?.value ?? null;

      if (this[ key ]) processed++;
    };

    return processed;
  };

  /**
   * @param {{ key: string, value?: any }[]} propertyData
   * @returns {{ getProperty: ({ key: string }[]) => results: { key: string, value: any }[], editProperty: (propertyEditData: { value: any }[], debug?: boolean) => { key: string, oldValue: any, newValue: any}[]}}
   */
  setProperty(...propertyData) {
    const propertyDataError = new this.checker.BaseChecker(propertyData).Error;
    propertyDataError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'propertyData'.")
      .setCondition("isNotArray")
      .setType("InvalidType")
      .throw();

    const properties = [];

    for (let index = 0; index < propertyData.length; index++) {
      const property = propertyData[ index ];

      if (!property?.key) return;

      properties.push({ key: property.key.toLowerCase(), value: property?.value });
    };

    this.#defineProperty(...properties);

    return this;
  };

  /**
   * Get the properties.
   * @param {{ key: string }[]} propertyData
   * @returns {{ results: { key: string, value: any }[], editProperty: (propertyEditData: { value: any }[], debug?: boolean) => { key: string, oldValue: any, newValue: any}[] }}
   */
  getProperty(...propertyData) {
    const propertyDataError = new this.checker.BaseChecker(propertyData).Error;
    propertyDataError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'propertyData'.")
      .setCondition("isNotArray")
      .setType("InvalidType")
      .throw();

    const results = [];

    for (let index = 0; index < propertyData.length; index++) {
      const property = propertyData[ index ];

      if (!property?.key) return;

      const key = property.key.toLowerCase();

      results.push({ key, value: this[ key ] });
    };

    const base = this;

    /**
     * Edit the properties.
     * @param {boolean} debug
     * @param {{ value: any }[]} propertyEditData 
     * @returns {{ key: string, oldValue: any, newValue: any }[]}
     */
    function editProperty(debug = false, ...propertyEditData) {
      const propertyEditDataError = new this.checker.BaseChecker(propertyEditData).Error;
      propertyEditDataError.setName("ValidationError")
        .setMessage("An invalid type was specified for 'propertyEditData'.")
        .setCondition("isNotArray")
        .setType("InvalidType")
        .throw();

      const data = [];

      for (let index = 0; index < propertyEditData.length; index++) {
        const property = results[ index ];
        const editData = propertyEditData[ index ];

        const key = property[ key ];

        const oldValue = base[ key ];
        base[ key ] = editData?.value ?? null;
        const newValue = base[ key ];

        if (debug) console.log(`Structure[${base.constructor.name}[Property[${key}[${newValue}]]]]: Value changed from '${oldValue}' to '${newValue}'`);

        data.push({ key, oldValue, newValue });
      };

      return data;
    };

    return { results, editProperty };
  };

  /**
   * Create a new Discord Webhook.
   * @param {{ url?: string, id?: string, token?: string}} options 
   */
  createWebhook(options = { url: null, id: null, token: null }) {
    const optionsError = new this.checker.BaseChecker(options).Error;
    optionsError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'options'.")
      .setCondition("isNotObject")
      .setType("InvalidType")
      .throw();

    const { id, token, url } = options;

    const webhook = new Client({ url, id, token });
    this.webhook = webhook;

    /**
     * Send message with created webhook.
     * @param {{ content?: string, embeds?: EmbedBuilder[], components?: ActionRowBuilder[] }} sendOptions 
     */
    function send(sendOptions = { content: "New Message!", embeds: [], components: [] }) {
      return webhook.send({ content: sendOptions?.content, embeds: sendOptions?.embeds, components: sendOptions?.components });
    };

    return { send };
  };

  /**
   * The command to execute the event.
   * @returns {void}
   */
  execute() {
    console.log("This function is not implemented.");

    return void 0;
  };

  /**
   * It is triggered when there is an error in the event.
   * @returns {void}
   */
  error({ error: err }) {
    console.log(err);

    return void 0;
  };

  static version = "v1.0.10";
};