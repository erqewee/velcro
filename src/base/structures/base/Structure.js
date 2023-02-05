import Discord, {
  ChannelType, PermissionsBitField,
  EmbedBuilder, StringSelectMenuBuilder, UserSelectMenuBuilder, ButtonBuilder, ActionRowBuilder, TextInputBuilder, ModalBuilder, AttachmentBuilder, SlashCommandBuilder, ContextMenuCommandBuilder,
  TextInputStyle, ButtonStyle,
  Client, WebhookClient,
  ComponentType, ApplicationCommandType
} from "discord.js";
const { Interaction } = Discord;

import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";

import { Data, Emoji } from "../../../config/export.js";

import {
  UserManager, GuildManager,
  MessageManager, EmojiManager,
  ChannelManager, InviteManager,
  VoiceManager, MemberManager,
  RoleManager, WebhookManager,
  API
} from "../../../api/export.js";

import { deprecate as deprecated } from "node:util";

import { Checker } from "../../export.js";
import { Market } from "../../classes/Exchange/Market.js";

import { CommandsCache, EventsCache, HandlersCache, LanguagesCache, CooldownsCache } from "../../classes/Loader/LoaderCache.js";

import { Database } from "../../classes/Database/Database.js";
const Economy = new Database("JSON", { path: "./src/base", dir: "databases", name: "Economy" });
const Subscribe = new Database("JSON", { path: "./src/base", dir: "databases", name: "Subscribe" });
const General = new Database("JSON", { path: "./src/base", dir: "databases", name: "General" });

import lodash from "lodash";
const { get } = lodash;

import { s } from "@sapphire/shapeshift";

export class Structure {
  /**
   * @returns {Client}
   */
  get client() {
    return global.client;
  };

  Embed = EmbedBuilder;
  Button = ButtonBuilder;
  Row = ActionRowBuilder;
  TextInput = TextInputBuilder;
  Modal = ModalBuilder;
  StringMenu = StringSelectMenuBuilder;
  UserMenu = UserSelectMenuBuilder;
  Attachment = AttachmentBuilder;
  Webhook = WebhookClient;

  SlashCommand = SlashCommandBuilder;
  ContextCommand = ContextMenuCommandBuilder;

  CommandType = ApplicationCommandType;
  TextInputStyle = TextInputStyle;
  ChannelType = ChannelType;
  ButtonStyle = ButtonStyle;
  Permissions = PermissionsBitField.Flags;
  Component = ComponentType;

  /**
   * Guild Manager
   */
  guilds = new GuildManager(this.client); // Required Client, Because includes cache system.
  /**
   * Emoji Manager
   */
  emojis = new EmojiManager(this.client); // Required Client, Because includes cache system.
  /**
   * Voice Connection Manager
   */
  connections = new VoiceManager(this.client); // Required Client, Because uses DiscordJS methods.
  /**
   * Channel Manager
   */
  channels = new ChannelManager(this.client); // Required Client, Because includes cache system.
  /**
   * Invite Manager
   */
  invites = new InviteManager(this.client); // Required Client, Because includes cache system.
  /**
   * Member Manager
   */
  members = new MemberManager(this.client); // Required Client, Because includes cache system.
  /**
   Role Manager
   */
  roles = new RoleManager(this.client); // Required Client, Because uses DiscordJS methods.
  /**
   * Webhook Manager
   */
  webhooks = new WebhookManager();
  /**
   * User Manager
   */
  users = new UserManager(this.client); // Required Client, Because uses DiscordJS methods.
  /**
   * Message Manager
   */
  messages = new MessageManager(this.client); // Required Client, Because uses DiscordJS methods.

  /**
   * Checker
   */
  checker = new Checker();

  /** 
   * Custom API (for custom requests)
   */
  api = new API();

  /**
   * Market for Economy
   */
  market = new Market(Economy);

  loader = { commands: CommandsCache, events: EventsCache, handlers: HandlersCache, languages: LanguagesCache, cooldowns: CooldownsCache };
  databases = { economy: Economy, subscribe: Subscribe, general: General };
  config = { Data, Emoji };

  /**
   * Encrypts the entered string.
   * @param {string} message 
   * @param {string} algorithm 
   * @returns {{data: string, init: Buffer, key: Buffer}}
   */
  encrypt(message, algorithm = "aes-256-cbc") {
    s.string.parse(message);
    s.string.parse(algorithm);

    const initVector = randomBytes(16);
    const Securitykey = randomBytes(32);

    const cipher = createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");

    return { data: encryptedData, init: initVector, key: Securitykey };
  };

  /**
   * Decrypts the entered string.
   * @param {string} data 
   * @param {Buffer} key 
   * @param {Buffer} init 
   * @param {string} algorithm 
   * @returns {{data: string}}
   */
  decrypt(data, key, init, algorithm = "aes-256-cbc") {
    s.string.parse(data);
    s.string.parse(algorithm);

    const decipher = createDecipheriv(algorithm, key, init);
    let decryptedData = decipher.update(data, "hex", "utf-8");
    decryptedData += decipher.final("utf8");

    return { data: decryptedData };
  };

  /**
   * Set the function to deprecated.
   * @param {Function} functionStructure 
   * @param {{ name: string, code: number, use: string }} options 
   * @returns {Function}
   */
  deprecate(functionStructure = function () { }, options = { name: "myCoolFunction()", code: 0, use: "myCoolGoldFunction()" }) {
    const functionError = new this.checker.BaseChecker(functionStructure).Error;
    functionError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'function'.")
      .setCondition("isNotFunction")
      .setType("InvalidType")
      .throw();

    const deprecateFunction = deprecated(functionStructure, `${options.name.endsWith("()") ? options.name : options.name + "()"} is deprecated. Please use ${options.use.endsWith("()") ? options.use : options.use + "()"} instead.`, String(code));

    return deprecateFunction();
  };

  /**
   * Transform time.
   * @param {number} unixCode 
   * @param {string} format 
   * @param {{format?: string, onlyNumberOutput?: boolean}} options 
   * @returns {string | number}
   */
  time(unixCode = Date.now(), options = { format: "R", onlyNumberOutput: false }) {
    const { format, onlyNumberOutput: OnO } = options;

    const unixError = new this.checker.BaseChecker(unixCode).Error;
    unixError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'unix'.")
      .setCondition("isNotNumber")
      .setType("InvalidType")
      .throw();

    let formattedTime = Math.floor(unixCode / 1000);

    let dateFormat = `<t:${formattedTime}:R>`;

    if (format === "t") dateFormat = `<t:${formattedTime}:${format}>`;
    else if (format === "T") dateFormat = `<t:${formattedTime}:${format}>`;
    else if (format === "d") dateFormat = `<t:${formattedTime}:${format}>`;
    else if (format === "D") dateFormat = `<t:${formattedTime}:${format}>`;
    else if (format === "f") dateFormat = `<t:${formattedTime}:${format}>`;
    else if (format === "F") dateFormat = `<t:${formattedTime}:${format}>`;

    let output = dateFormat;
    if (OnO) output = formattedTime;

    return output;
  };

  /**
   * Create new Discord Codeblock.
   * @param {string} text 
   * @param {string} blockType 
   * @returns {string}
   */
  code(text = "console.log('Hello World!');", type = "JS") {
    const textError = new this.checker.BaseChecker(text).Error;
    textError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'text'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const typeError = new this.checker.BaseChecker(type).Error;
    typeError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'type'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const output = `\`\`\`${type?.toLowerCase() ?? ""}\n${String(text)}\`\`\``;

    return output;
  };

  /**
   * Translate the entered string.
   * @param {string} key 
   * @param {{locate: string, variables: { name: string, value: any }[]}} options 
   * @returns {string}
   */
  translate(key, options = { locate: Data.LANG, variables: [] }) {
    const { locate: l, variables: v } = options;

    let locate = l;
    if (!locate) locate = this.loader.languages.fetch(Data.LANG) ? Data.LANG : this.loader.languages.keys()[ 0 ];

    let variables = v;
    if (!variables) variables = [];

    const keyError = new this.checker.BaseChecker(key).Error;
    keyError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'key'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const locateError = new this.checker.BaseChecker(locate).Error;
    locateError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'locate'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const variableError = new this.checker.BaseChecker(variables).Error;
    variableError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'variables'.")
      .setCondition("isNotArray")
      .setType("InvalidType")
      .throw();

    const requestedPathFormat = /^[a-z]+:[a-z]+(\.[a-z]+){0,15}$/;
    const requestedLocateFormat = /^[a-z]{2}(?:-[A-Z]{2})?$/;

    s.string.regex(requestedPathFormat).parse(key);
    s.string.regex(requestedLocateFormat).parse(locate);

    if (!this.loader.languages.has(locate)) locate = this.loader.languages.keys()[ 0 ];

    const translations = this.loader.languages.get(locate);

    const object = new Object(translations);

    const translationSource = get(object, key.slice(5));

    const sourcerror = new this.checker.BaseChecker(translationSource).Error;
    sourcerror.setName("ValidationError")
      .setMessage("No language resource found.")
      .setCondition("isUndefined")
      .setType("InvalidType")
      .throw();

    let translation = String(translationSource);
    for (let index = 0; index < variables.length; index++) {
      const variable = variables[ index ];

      const nameError = new this.checker.BaseChecker(variable?.name).Error;
      nameError.setName("ValidationError")
        .setMessage("An invalid type was specified for 'name'.")
        .setCondition("isNotString")
        .setType("InvalidType")
        .throw();

      if (!translation.includes(`{${variable.name}}`)) throw new Error("Varible not found.");

      translation = translation.replaceAll(`{${variable.name}}`, variable?.value ?? undefined);
    };

    return translation;
  };

  /**
   * Discord Pagination System
   * @param {Interaction} interaction 
   * @param {{embeds: EmbedBuilder[], buttons: ButtonBuilder[]}} options
   * @returns {Interaction}
   */
  async pagination(interaction, { embeds = [], buttons = [] }) {
    const interactionError = new this.checker.BaseChecker(interaction).Error;
    interactionError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'interaction'.")
      .setCondition("isNotObject")
      .setType("InvalidType")
      .throw();

    const embedsError = new this.checker.BaseChecker(embeds).Error;
    embedsError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'embeds'.")
      .setCondition("isNotArray")
      .setType("InvalidType")
      .throw();

    const buttonsError = new this.checker.BaseChecker(buttons).Error;
    buttonsError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'buttons'.")
      .setCondition("isNotArray")
      .setType("InvalidType")
      .throw();

    const first = new this.Button({
      style: ButtonStyle.Secondary,
      emoji: { name: "Pagination_First", id: "1042498687533846528" },
      customId: "0",
    });

    const prev = new this.Button({
      style: ButtonStyle.Primary,
      emoji: { name: "Pagination_Previous", id: "1042498269013622844" },
      customId: "1",
    });

    const del = new this.Button({
      style: ButtonStyle.Danger,
      emoji: { name: "Pagination_Delete", id: "1042498264517312582" },
      customId: "2",
    });

    const next = new this.Button({
      style: ButtonStyle.Primary,
      emoji: { name: "Pagination_Next", id: "1042498266765471814" },
      customId: "3",
    });

    const last = new this.Button({
      style: ButtonStyle.Secondary,
      emoji: { name: "Pagination_Last", id: "1042498633532186695" },
      customId: "4",
    });

    const buttonsRow = new this.Row({
      components: [ first, prev, del, next, last ]
    });

    let currentPage = 0;

    const disableFirst = ButtonBuilder.from(first).setDisabled(true).setStyle(ButtonStyle.Danger);
    const disableLast = ButtonBuilder.from(last).setDisabled(true).setStyle(ButtonStyle.Danger);
    const disablePrev = ButtonBuilder.from(prev).setDisabled(true).setStyle(ButtonStyle.Danger);
    const disableNext = ButtonBuilder.from(next).setDisabled(true).setStyle(ButtonStyle.Danger);

    const styledDelete = ButtonBuilder.from(del).setStyle(ButtonStyle.Success);

    const components = [
      new ActionRowBuilder({
        components: [
          currentPage === 0 ? disableFirst : first,
          currentPage === 0 ? disablePrev : prev,
          currentPage === 0 || embeds.length - 1 ? styledDelete : del,
          currentPage === embeds.length - 1 ? disableNext : next,
          currentPage === embeds.length - 1 ? disableLast : last
        ]
      })
    ];
    components.concat(buttons);

    let sendMessage;

    if (embeds.length === 0) {
      if (interaction.deferred) return interaction.followUp({ embeds: [ embeds[ 0 ] ], components });
      else sendMessage = interaction.replied ? await interaction.editReply({ embeds: [ embeds[ 0 ] ], components }) : await interaction.reply({ embeds: [ embeds[ 0 ] ], components });
    };

    embeds = embeds.map((embed, _index) => {
      const INDEX = (_index + 1);

      return embed.setFooter({ text: `Total: ${embeds.length} | Viewing: ${INDEX} | Remaining: ${embeds.length - INDEX}`, iconURL: interaction.guild?.iconURL() });
    });

    if (interaction.deferred) sendMessage = await interaction.followUp({ embeds: [ embeds[ 0 ] ], components });
    else sendMessage = interaction.replied ? await interaction.editReply({ embeds: [ embeds[ 0 ] ], components }) : await interaction.reply({ embeds: [ embeds[ 0 ] ], components });

    let filter = async (m) => {
      const components = [ new ActionRowBuilder({ components: [ del ] }) ];

      let msg;

      if (m.member.id !== interaction.member.id) msg = await interaction.followUp({ content: `${this.config.Emoji.State.ERROR} ${m.member}, You cannot interact with this buttons.`, components, ephemeral: true });

      await msg?.createMessageComponentCollector().on("collect", async (i) => {
        if (!i.isButton()) return;

        await i.deferUpdate().catch(() => { });

        if (i.customId === "2") msg.delete();
      });

      return m.member.id === interaction.member.id;
    };

    const collector = await sendMessage.createMessageComponentCollector({ filter });

    collector.on("collect", async (i) => {
      if (!i.isButton()) return;

      await i.deferUpdate().catch(() => { });

      switch (i.customId) {
        case "0": {
          currentPage = 0;

          const components = [
            new ActionRowBuilder({
              components: [
                currentPage === 0 ? disableFirst : first,
                currentPage === 0 ? disablePrev : prev,
                currentPage === 0 ? styledDelete : del,
                currentPage === embeds.length - 1 ? disableNext : next,
                currentPage === embeds.length - 1 ? disableLast : last
              ]
            })
          ];
          components.concat(buttons);

          await sendMessage.edit({ embeds: [ embeds[ currentPage ] ], components }).catch(() => { });

          break;
        };
        case "1": {
          if (currentPage !== 0) {
            currentPage--;

            const components = [
              new ActionRowBuilder({
                components: [
                  currentPage === 0 ? disableFirst : first,
                  currentPage === 0 ? disablePrev : prev,
                  currentPage === 0 ? styledDelete : del,
                  currentPage === embeds.length - 1 ? disableNext : next,
                  currentPage === embeds.length - 1 ? disableLast : last
                ]
              })
            ];
            components.concat(buttons);

            await sendMessage.edit({ embeds: [ embeds[ currentPage ] ], components }).catch(() => { });
          } else {
            currentPage = (embeds.length - 1);

            const components = [
              new ActionRowBuilder({
                components: [
                  currentPage === 0 ? disableFirst : first,
                  currentPage === 0 ? disablePrev : prev,
                  currentPage === 0 ? styledDelete : del,
                  currentPage === embeds.length - 1 ? disableNext : next,
                  currentPage === embeds.length - 1 ? disableLast : last
                ]
              })
            ];
            components.concat(buttons);

            await sendMessage.edit({ embeds: [ embeds[ currentPage ] ], components }).catch(() => { });
          };

          break;
        };
        case "2": {
          components[ 0 ].components.map((btn) => {
            btn.setDisabled(true);
            btn.setStyle(this.ButtonStyle.Secondary)
          });

          await sendMessage.edit({
            embeds: [ embeds[ currentPage ] ],
            components
          }).catch(() => { });

          break;
        };
        case "3": {
          if (currentPage < (embeds.length - 1)) {
            currentPage++;

            const components = [
              new ActionRowBuilder({
                components: [
                  currentPage === 0 ? disableFirst : first,
                  currentPage === 0 ? disablePrev : prev,
                  currentPage === embeds.length - 1 ? styledDelete : del,
                  currentPage === embeds.length - 1 ? disableNext : next,
                  currentPage === embeds.length - 1 ? disableLast : last
                ]
              })
            ];
            components.concat(buttons);

            await sendMessage.edit({ embeds: [ embeds[ currentPage ] ], components }).catch(() => { });
          } else {
            currentPage = 0;

            const components = [
              new ActionRowBuilder({
                components: [
                  currentPage === 0 ? disableFirst : first,
                  currentPage === 0 ? disablePrev : prev,
                  currentPage === 0 || embeds.length - 1 ? styledDelete : del,
                  currentPage === embeds.length - 1 ? disableNext : next,
                  currentPage === embeds.length - 1 ? disableLast : last
                ]
              })
            ];
            components.concat(buttons);

            await sendMessage.edit({ embeds: [ embeds[ currentPage ] ], components }).catch(() => { });
          };

          break;
        };
        case "4": {
          currentPage = (embeds.length - 1);

          const components = [
            new ActionRowBuilder({
              components: [
                currentPage === 0 ? disableFirst : first,
                currentPage === 0 ? disablePrev : prev,
                currentPage === embeds.length - 1 ? styledDelete : del,
                currentPage === embeds.length - 1 ? disableNext : next,
                currentPage === embeds.length - 1 ? disableLast : last
              ]
            })
          ];
          components.concat(buttons);

          await sendMessage.edit({ embeds: [ embeds[ currentPage ] ], components }).catch(() => { });

          break;
        };

        default: null;
      };
    });

    collector.on("end", async () => {
      components[ 0 ].components.map((btn) => {
        btn.setDisabled(true);
        btn.setStyle(this.ButtonStyle.Secondary);
      });

      await sendMessage.edit({
        embeds: [ embeds[ 0 ] ],
        components
      }).catch(() => { });
    });

    return interaction;
  };

  static version = "v1.0.3";
};