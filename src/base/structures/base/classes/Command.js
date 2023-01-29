import { Structure as CommandStructure } from "../Structure.js";

import { PermissionsBitField as P } from "discord.js";
import { PermissionsBitField } from "discord.js";
const Permissions = P.Flags;

export class Command extends CommandStructure {
  constructor(commandOptions = { enabled: true, mode: "Global", permissions: [] }) {
    super();

    const { enabled, mode, permissions } = commandOptions;

    const enabledChecker = new this.checker.BaseChecker(enabled);
    const modeChecker = new this.checker.BaseChecker(mode);
    const permissionsChecker = new this.checker.BaseChecker(permissions);

    if (permissionsChecker.isNotArray) this.permissions = [];

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
   * Command Permissions
   */
  permissions = [];

  /**
   * Converts the string to a readable object.
   * @param {object|string} data 
   * @returns {object}
   */
  toJSON(data = new this.Command()) {
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

    this.data = json;

    return json;
  };

  /**
   * Change the command's state.
   * @param {boolean} state 
   * @returns {boolean}
   */
  setEnabled(state = true) {
    const stateChecker = new this.checker.BaseChecker(state);
    stateChecker.createError(stateChecker.isNotBoolean, "state", { expected: "Boolean" }).throw();

    this.enabled = state;

    return state;
  };

  /**
   * Set the command's execution command.
   * @param {Function} callback 
   * @returns {Function}
   */
  setExecute(callback = () => { }) {
    const callbackChecker = new this.checker.BaseChecker(callback);
    callbackChecker.createError(callbackChecker.isNotFunction, "callback", { expected: "Function" }).throw();

    this.execute = callback;

    return callback;
  };

  /**
   * Set the command's permissions.
   * @param {Permissions[]} permissions
   * @returns {Permissions[]}
   */
  setPermissions(...permissions) {
    const permissionChecker = new this.checker.BaseChecker(permissions);
    permissionChecker.createError(permissionChecker.isNotArray, "permissions", { expected: "Array" }).throw();

    for (let index = 0; index < permissions.length; index++) {
      const permission = permissions[ index ];

      const resolvePermission = PermissionsBitField.resolve(permission);

      if (resolvePermission) this.permissions.push(permission);
      else console.log(`Error[InvalidPermission]: '${permission}' is not valid a discord permission.`);
    };

    return this.permissions;
  };

  /**
   * Set the mode of the command.
   * @param {string} mode 
   * @returns {string}
   */
  setMode(mode = "Developer") {
    const modeChecker = new this.checker.BaseChecker(mode);
    modeChecker.createError(modeChecker.isNotString, "mode", { expected: "String" }).throw();

    const availableModes = [ "global", "developer" ];

    const m = String(mode).toLowerCase();

    if (!availableModes.includes(m)) throw new Error("InvalidMode", `'${m}' is not a valid mode.`);

    this.mode = m;
    this.developer = m.includes("developer") ? true : false;

    return mode;
  };

  /**
   * Define properties.
   * @param {{ key: string, value: any }[]} propertyData 
   * @returns {void}
   */
  #defineProperty(...propertyData) {
    const propertyDataChecker = new this.checker.BaseChecker(propertyData);
    propertyDataChecker.createError(propertyDataChecker.isNotArray, "propertyData", { expected: "Array" }).throw();

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
    const propertyDataChecker = new this.checker.BaseChecker(propertyData);
    propertyDataChecker.createError(propertyDataChecker.isNotArray, "propertyData", { expected: "Array" }).throw();

    const properties = [];

    for (let index = 0; index < propertyData.length; index++) {
      const property = propertyData[ index ];

      if (!property?.key) return;

      properties.push({ key: property.key.toLowerCase(), value: property?.value });
    };

    this.#defineProperty(...properties);

    return { getProperty: this.getProperty };
  };

  /**
   * Get the properties.
   * @param {{ key: string }[]} propertyData
   * @returns {{ results: { key: string, value: any }[], editProperty: (propertyEditData: { value: any }[], debug?: boolean) => { key: string, oldValue: any, newValue: any}[] }}
   */
  getProperty(propertyData = []) {
    const propertyDataChecker = new this.checker.BaseChecker(propertyData);
    propertyDataChecker.createError(propertyDataChecker.isNotArray, "propertyData", { expected: "Array" }).throw();

    const results = [];

    for (let index = 0; index < propertyData.length; index++) {
      const property = propertyData[ index ];

      const key = property.key.trim().toLowerCase();

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
      const propertyEditDataChecker = new this.checker.BaseChecker(propertyEditData);
      propertyEditDataChecker.createError(propertyEditDataChecker.isNotArray, "propertyEditData", { expected: "Array" }).throw();

      const data = [];

      for (let index = 0; index < propertyEditData.length; index++) {
        const property = results[ index ];
        const editData = propertyEditData[ index ];

        const key = property[ key ];

        const oldValue = base[ key ];
        base[ key ] = editData?.value ?? null;
        const newValue = base[ key ];

        if (debug) console.log(`Structure[Command[${key}[${newValue}]]]: Value changed from '${oldValue}' to '${newValue}'`);

        data.push({ key, oldValue, newValue });
      };

      return data;
    };

    return { results, editProperty };
  };

  /**
   * The command to execute the command.
   * @returns {Promise<void>}
   */
  async execute({ interaction, member }) {
    await interaction.reply({ content: `${member}, This command function is not implemented.`, ephemeral: true });

    return void 0;
  };

  /**
   * It is triggered when there is an error in the command.
   * @returns {Promise<void>}
   */
  async error({ interaction, error: err, command }) {
    const member = interaction.member;

    const errorEmbed = new this.Embed({
      title: `${this.config.Emoji.State.ERROR} An error ocurred.`,
      description: `${this.config.Emoji.Other.NOTEPAD} I'm reported this error to my Developers.`,
      footer: {
        text: `> Please check again later...`
      },
      thumbnail: {
        url: interaction.user?.avatarURL()
      }
    });

    const guild = this.emojis.cache.get("1035523616726593547");
    const invites = await this.invites.map(this.config.Data.Configurations.SUPPORT_SERVER);

    const row = new this.Row({
      components: [
        new this.Button({
          style: this.ButtonStyle.Link,
          label: "Support Server",
          emoji: { id: guild.id, name: guild.name, animated: guild.animated },
          url: invites.length > 0 ? `https://discord.gg/${invites[ 0 ].code}` : "https://discord.com",
          disabled: invites.length > 0 ? false : true
        })
      ]
    });

    const reportEmbed = new this.Embed({
      title: `${this.config.Emoji.State.ERROR} An error ocurred when executing command.`,
      description: `\`\`\`js\n${err}\`\`\``,
      fields: [
        {
          name: `${this.config.Emoji.Other.USER} Author`,
          value: `- ${member} (${member.id})`,
          inline: true
        },
        {
          name: `${this.config.Emoji.Other.CALENDAR} Time`,
          value: `- ${this.time(Date.now())}`,
          inline: true
        },
        {
          name: `${this.config.Emoji.Other.PROTOTIP} Command`,
          value: `- ${command.data.name}`,
          inline: true
        }
      ]
    });

    console.log(err);

    const log = client.channels.resolve(this.config.Data.Configurations.LOG_CHANNEL);

    if (interaction.replied) await interaction.followUp({ embeds: [ errorEmbed ], ephemeral: true, fetchReply: true }).then(async () => log.send({
      content: `<@&1031151171202732032>`, embeds: [ reportEmbed ], components: [ row ]
    })
      .then((msg) => this.messages.pin(msg)));
    else await interaction.reply({ embeds: [ errorEmbed ], ephemeral: true, fetchReply: true }).then(async () => log.send({
      content: `<@&1031151171202732032>`, embeds: [ reportEmbed ], components: [ row ]
    })
      .then((msg) => this.messages.pin(msg)));

    return void 0;
  };

  static version = "v1.0.0";
};