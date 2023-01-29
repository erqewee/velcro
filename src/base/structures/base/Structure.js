import Discord, {
  ButtonStyle, ChannelType, PermissionsBitField,
  EmbedBuilder, StringSelectMenuBuilder,
  UserSelectMenuBuilder, ButtonBuilder,
  ActionRowBuilder, TextInputBuilder,
  TextInputStyle, ModalBuilder,
  AttachmentBuilder, SlashCommandBuilder,
  Client, WebhookClient
} from "discord.js";
const { Interaction } = Discord;

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

import { CommandsCache, EventsCache, HandlersCache, LanguagesCache } from "../../classes/Loader/LoaderCache.js";

import { Database } from "../../classes/Database/Database.js";
const Economy = new Database("JSON", { path: "./src/base", dir: "databases", name: "Economy" });
const Subscribe = new Database("JSON", { path: "./src/base", dir: "databases", name: "Subscribe" });
const General = new Database("JSON", { path: "./src/base", dir: "databases", name: "General" });

import lodash from "lodash";
const { get } = lodash;

export class Structure {
  client = global.client;

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
  Command = this.SlashCommand;

  TextInputStyle = TextInputStyle;
  ChannelType = ChannelType;
  ButtonStyle = ButtonStyle;
  Permissions = PermissionsBitField.Flags;

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

  loader = { commands: CommandsCache, events: EventsCache, handlers: HandlersCache, languages: LanguagesCache };
  databases = { economy: Economy, subscribe: Subscribe, general: General };
  config = { Data, Emoji };

  /**
   * Set the function to deprecated.
   * @param {Function} functionStructure 
   * @param {{ name: string, code: number, use: string }} options 
   * @returns {Function}
   */
  deprecate(functionStructure = function () { }, options = { name: "myCoolFunction()", code: 0, use: "myCoolGoldFunction()" }) {
    const structureChecker = new Checker.BaseChecker(functionStructure);
    structureChecker.createError(structureChecker.isNotFunction, "structure", "InvalidType", { expected: "Function" }).throw();

    const nameChecker = new Checker.BaseChecker(options?.name);
    nameChecker.createError(nameChecker.isNotString, "options#name", "InvalidType", { expected: "String" });

    const codeChecker = new Checker.BaseChecker(options?.code);
    codeChecker.createError(codeChecker.isNotNumber, "options#code", "InvalidType", { expected: "Number" });

    const deprecateFunction = deprecated(functionStructure, `${options.name.endsWith("()") ? options.name : options.name + "()"} is deprecated. Please use ${options.use.endsWith("()") ? options.use : options.use + "()"} instead.`, String(code));

    return deprecateFunction;
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

    const unixCodeChecker = new Checker.BaseChecker(unixCode);
    unixCodeChecker.createError(unixCodeChecker.isNotNumber, "unixCode", "InvalidType", { expected: "Number" }).throw();

    const formatChecker = new Checker.BaseChecker(format);
    formatChecker.createError(formatChecker.isNotString, "format", "InvalidType", { expected: "String" }).throw();

    const optionsChecker = new Checker.BaseChecker(options);
    optionsChecker.createError(optionsChecker.isNotObject, "options", "InvalidType", { expected: "Object" }).throw();

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
    const textChecker = new Checker.BaseChecker(text);
    textChecker.createError(textChecker.isNotString, "text", "InvalidType", { expected: "String" }).throw();

    const typeChecker = new Checker.BaseChecker(type);
    typeChecker.createError(typeChecker.isNotString, "type", "InvalidType", { expected: "String" }).throw();

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
    if (!locate) locate = Data.LANG;

    let variables = v;
    if (!variables) variables = [];

    const keyChecker = new Checker.BaseChecker(key);
    keyChecker.createError(keyChecker.isNotString, "key", "InvalidType", { expected: "String" }).throw();

    const locateChecker = new Checker.BaseChecker(locate);
    locateChecker.createError(locateChecker.isNotString, "locate", "InvalidType", { expected: "String" }).throw();

    const variableChecker = new Checker.BaseChecker(variables);
    variableChecker.createError(variableChecker.isNotArray, "variable", "InvalidType", { expected: "Array" }).throw();

    const requestedPathFormat = /^[a-z]+:[a-z]+(\.[a-z]+){0,15}$/;
    const requestedLocateFormat = /^[a-z]{2}(?:-[A-Z]{2})?$/;

    const checker = new Checker.BaseChecker(" ");

    checker.createError(!key.match(requestedPathFormat), "key", "Not Requested Format", { expected: ["data:events", "data:examples.source"], received: (key) }).throw();
    checker.createError(!locate.match(requestedLocateFormat), "locate", "Not Requested Format", { expected: ["az-AZ", "tr", "xx", "xx-XX"], received: (locate) }).throw();

    checker.createError(!this.loader.languages.has(locate), "locate", "Language Not Found", { expected: locate }).throw();

    const translations = this.loader.languages.get(locate);

    const object = new Object(translations);

    const translationSource = get(object, key.slice(5));

    const sourceControlChecker = new Checker.BaseChecker(translationSource);
    sourceControlChecker.createError(sourceControlChecker.isUndefined, "locate", "Language Not Found", { received: key }).throw();

    let translation = String(translationSource);
    for (let index = 0; index < variables.length; index++) {
      const variable = variables[index];

      const variableNameChecker = new Checker.BaseChecker(variable?.name);
      variableNameChecker.createError(variableNameChecker.isNotString, "variable#name", "Not Found").throw();

      checker.createError(!translation.includes(`{${variable.name}}`), "variable", "Not Found").throw();

      translation = translation.replaceAll(`{${variable.name}}`, variable?.value ?? undefined);
    };

    return translation;
  };

  /**
   * Get the first character of the entered string.
   * @param {string} string 
   */
  first(string = "Hello World!") {
    const stringChecker = new Checker.BaseChecker(string);
    stringChecker.createError(stringChecker.isNotString, "string", "InvalidType", { expected: "String" }).throw();

    let firstCharacter;

    string.replace(/^\w/, (char) => firstCharacter = char);

    return {
      firstCharacter,

      /**
       * Converts the first character received to uppercase.
       * @returns {string}
       */
      toUpper: function () {
        const newString = (firstCharacter).toUpperCase() + string;

        return newString;
      },

      /**
       * Converts the first character received to lowercase.
       * @returns {string}
       */
      toLower: function () {
        const newString = (firstCharacter).toLowerCase() + string;

        return newString;
      }
    };
  };

  /**
   * Get the last character of the entered string.
   * @param {string} string 
   */
  last(string = "Hello World!") {
    const stringChecker = new Checker.BaseChecker(string);
    stringChecker.createError(stringChecker.isNotString, "string", "InvalidType", { expected: "String" }).throw();

    const lastCharacter = string.substring(0, (string.length - 1)) + string[(string.length - 1)];

    return {
      lastCharacter,

      /**
       * Converts the last character received to uppercase.
       * @returns {string}
       */
      toUpper: function () {
        const newString = lastCharacter.toUpperCase();

        return newString;
      },

      /**
       * Converts the last character received to lowercase.
       * @returns {string}
       */
      toLower: function () {
        const newString = lastCharacter.toLowerCase();

        return newString;
      }
    };
  };

  /**
   * Discord Pagination System
   * @param {Interaction} interaction 
   * @param {{embeds: EmbedBuilder[], buttons: ButtonBuilder[]}} options
   * @returns {Interaction}
   */
  async pagination(interaction, { embeds = [], buttons = [] }) {
    const interactionChecker = new Checker.BaseChecker(interaction);
    interactionChecker.createError(!interactionChecker.isObject, "interaction", "InvalidType", { expected: "Object", received: interactionChecker }).throw();

    const embedsChecker = new Checker.BaseChecker(embeds);
    embedsChecker.createError(!embedsChecker.isArray, "embeds", "InvalidType", { expected: "Array", received: embedsChecker }).throw();

    const buttonsChecker = new Checker.BaseChecker(buttons);
    buttonsChecker.createError(!buttonsChecker.isArray, "buttons", "InvalidType", { expected: "Array", received: buttonsChecker }).throw();

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
      components: [first, prev, del, next, last]
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
      if (interaction.deferred) return interaction.followUp({ embeds: [embeds[0]], components });
      else sendMessage = interaction.replied ? await interaction.editReply({ embeds: [embeds[0]], components }) : await interaction.reply({ embeds: [embeds[0]], components });
    };

    embeds = embeds.map((embed, _index) => {
      const INDEX = (_index + 1);

      return embed.setFooter({ text: `Total: ${embeds.length} | Viewing: ${INDEX} | Remaining: ${embeds.length - INDEX}`, iconURL: interaction.guild?.iconURL() });
    });

    if (interaction.deferred) sendMessage = await interaction.followUp({ embeds: [embeds[0]], components });
    else sendMessage = interaction.replied ? await interaction.editReply({ embeds: [embeds[0]], components }) : await interaction.reply({ embeds: [embeds[0]], components });

    let filter = async (m) => {
      const components = [new ActionRowBuilder({ components: [del] })];

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

          await sendMessage.edit({ embeds: [embeds[currentPage]], components }).catch(() => { });

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

            await sendMessage.edit({ embeds: [embeds[currentPage]], components }).catch(() => { });
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

            await sendMessage.edit({ embeds: [embeds[currentPage]], components }).catch(() => { });
          };

          break;
        };
        case "2": {
          components[0].components.map((btn) => {
            btn.setDisabled(true);
            btn.setStyle(this.ButtonStyle.Secondary)
          });

          await sendMessage.edit({
            embeds: [embeds[currentPage]],
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

            await sendMessage.edit({ embeds: [embeds[currentPage]], components }).catch(() => { });
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

            await sendMessage.edit({ embeds: [embeds[currentPage]], components }).catch(() => { });
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

          await sendMessage.edit({ embeds: [embeds[currentPage]], components }).catch(() => { });

          break;
        };

        default: null;
      };
    });

    collector.on("end", async () => {
      components[0].components.map((btn) => {
        btn.setDisabled(true);
        btn.setStyle(this.ButtonStyle.Secondary);
      });

      await sendMessage.edit({
        embeds: [embeds[0]],
        components
      }).catch(() => { });
    });

    return interaction;
  };

  static version = "v1.0.3";
};