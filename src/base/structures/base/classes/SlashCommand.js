import { Structure as CommandStructure } from "../Structure.js";

import { PermissionsBitField as P } from "discord.js";
import { PermissionsBitField } from "discord.js";
const Permissions = P.Flags;

export class SlashCommand extends CommandStructure {
  constructor(commandOptions = { enabled: true, mode: "Global", permissions: [], cooldown: 5 }) {
    super();

    const { enabled, mode, permissions, cooldown } = commandOptions;

    const enabledChecker = new this.checker.BaseChecker(enabled);
    const modeChecker = new this.checker.BaseChecker(mode);
    const permissionsChecker = new this.checker.BaseChecker(permissions);
    const cooldownChecker = new this.checker.BaseChecker(cooldown);

    if (permissionsChecker.isNotArray) this.permissions = [];

    if (enabledChecker.isBoolean && enabled === true) this.setEnabled();
    if (modeChecker.isString && mode.toLowerCase() === "developer") this.setMode();

    if (cooldownChecker.isNumber) this.cooldown = cooldown;
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
   * Command Cooldown
   */
  cooldown = 5;

  /**
   * Converts the string to a readable object.
   * @param {object|string} data 
   * @returns {object}
   */
  toJSON(data = new this.SlashCommand()) {
    const SlashCommand = this.SlashCommand;
    const ContextCommand = this.ContextCommand;

    if ((!(data instanceof SlashCommand)) && (!(data instanceof ContextCommand))) throw new Error("UNEXPECTED_BUILDER", "This builder is not a 'SlashCommand'");

    const object = new Object(data);

    return object;
  };

  /**
   * Set the command.
   * @param {object|string} commandData 
   * @returns {this}
   */
  setCommand(commandData = {}) {
    const json = this.toJSON(commandData);

    this.data = json;

    return this;
  };

  /**
   * Change the command's state.
   * @param {boolean} state 
   * @returns {this}
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
   * Set the command's execution command.
   * @param {Function} callback 
   * @returns {this}
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
   * Set the command's cooldown.
   * @param {number} time 
   * @returns {this}
   */
  setCooldown(time = 5) {
    const timeError = new this.checker.BaseChecker(time).Error;
    timeError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'time'.")
      .setCondition("isNotNumber")
      .setType("InvalidType")
      .throw();

    this.cooldown = time;

    return this;
  };

  /**
   * Set the command's permissions.
   * @param {Permissions[]} permissions
   * @returns {this}
   */
  setPermissions(...permissions) {
    const permissionsError = new this.checker.BaseChecker(permissions).Error;
    permissionsError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'permissions'.")
      .setCondition("isNotArray")
      .setType("InvalidType")
      .throw();

    const settedPermissions = [];

    for (let index = 0; index < permissions.length; index++) {
      const permission = permissions[ index ];

      const resolvePermission = PermissionsBitField.resolve(permission);

      if (resolvePermission) settedPermissions.push(permission);
      else console.log(`Error[InvalidPermission]: '${permission}' is not valid a discord permission.`);
    };

    this.permissions = settedPermissions;

    return this;
  };

  /**
   * Set the mode of the command.
   * @param {string} mode 
   * @returns {this}
   */
  setMode(mode = "Developer") {
    const modeError = new this.checker.BaseChecker(mode).Error;
    modeError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'mode'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const availableModes = [ "global", "developer" ];

    const m = String(mode).toLowerCase();

    if (!availableModes.includes(m)) throw new Error("InvalidMode", `'${m}' is not a valid mode.`);

    this.mode = m;
    this.developer = m.includes("developer") ? true : false;

    return this;
  };

  /**
   * Define properties.
   * @param {{ key: string, value: any }[]} propertyData 
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
   * @returns {this}
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
          emoji: { id: guild?.id, name: guild?.name, animated: guild?.animated },
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
    else if (!interaction.deferred) await interaction.reply({ embeds: [ errorEmbed ], ephemeral: true, fetchReply: true }).then(async () => log.send({
      content: `<@&1031151171202732032>`, embeds: [ reportEmbed ], components: [ row ]
    })
      .then((msg) => this.messages.pin(msg)));
    else await interaction.editReply({ embeds: [ errorEmbed ], ephemeral: true, fetchReply: true }).then(async () => log.send({
      content: `<@&1031151171202732032>`, embeds: [ reportEmbed ], components: [ row ]
    })
      .then((msg) => this.messages.pin(msg)));

    return void 0;
  };

  static version = "v1.0.0";
};