import {
  ButtonStyle, ChannelType, PermissionsBitField,
  EmbedBuilder, StringSelectMenuBuilder,
  UserSelectMenuBuilder, ButtonBuilder,
  ActionRowBuilder, TextInputBuilder,
  TextInputStyle, ModalBuilder,
  AttachmentBuilder, SlashCommandBuilder
} from "discord.js";

import { Data, Emoji } from "../../../config/export.js";

import {
  UserManager, GuildManager,
  MessageManager, EmojiManager,
  ChannelManager, InviteManager,
  VoiceManager, MemberManager,
  RoleManager, WebhookManager
} from "../../../api/export.js";

import { Checker } from "../../classes/Checker.js";
const checker = new Checker();

import { CommandsCache, EventsCache, HandlersCache, LanguagesCache } from "../../classes/Loader/LoaderCache.js";

import { Database } from "../../classes/Database/Database.js";
const Economy = new Database("JSON", { path: "./src/base", dir: "databases", name: "Economy" });
const Subscribe = new Database("JSON", { path: "./src/base", dir: "databases", name: "Subscribe" });
const General = new Database("JSON", { path: "./src/base", dir: "databases", name: "General" });

import lodash from "lodash";
const { get } = lodash;

export class Structure {
  constructor() { };

  client = global.client;

  Embed = EmbedBuilder;
  Button = ButtonBuilder;
  Row = ActionRowBuilder;
  TextInput = TextInputBuilder;
  Modal = ModalBuilder;
  StringMenu = StringSelectMenuBuilder;
  UserMenu = UserSelectMenuBuilder;
  Attachment = AttachmentBuilder;

  SlashCommand = SlashCommandBuilder;
  Command = this.SlashCommand;

  TextInputStyle = TextInputStyle;
  ChannelType = ChannelType;
  ButtonStyle = ButtonStyle;
  Permissions = PermissionsBitField.Flags;

  guilds = new GuildManager(this.client); // Required Client, Because includes cache system.
  emojis = new EmojiManager(this.client); // Required Client, Because includes cache system.
  connections = new VoiceManager(this.client);
  channels = new ChannelManager(this.client); // Required Client, Because includes cache system.
  invites = new InviteManager(this.client); // Required Client, Because includes cache system.
  members = new MemberManager(this.client); // Required Client, Because includes cache system.
  roles = new RoleManager(this.client); // Required Client, Because uses DiscordJS methods.
  webhooks = new WebhookManager();
  users = new UserManager();
  messages = new MessageManager();

  checker = checker;

  loader = { commands: CommandsCache, events: EventsCache, handlers: HandlersCache, languages: LanguagesCache };
  databases = { economy: Economy, subscribe: Subscribe, general: General };
  config = { Data, Emoji };

  time(unixCode = Date.now(), format = "R", options = { onlyNumberOutput: false }) {
    if (!checker.check(unixCode).isNumber()) checker.error("unixCode", "InvalidType", { expected: "Number", received: (typeof unixCode) });
    if (!checker.check(format).isString()) checker.error("format", "InvalidType", { expected: "String", received: (typeof format) });

    if (!checker.check(options).isObject()) checker.error("options", "InvalidType", { expected: "Object", received: (typeof options) });
    if (!checker.check(options?.onlyNumberOutput).isNumber()) checker.error("options#onlyNumberOutput", "InvalidType", { expected: "Boolean", received: (typeof options?.onlyNumberOutput) });

    const { onlyNumberOutput: OnO } = options;

    let formattedTime = Math.floor(unixCode / 1000);

    let dateFormat = `<t:${formattedTime}:${format}>`;

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

  code(text = "console.log('Hello World!');", blockType = "JS") {
    if (!checker.check(text).isString()) checker.error("text", "InvalidType", { expected: "String", received: (typeof text) });
    if (!checker.check(blockType).isString()) checker.error("blockType", "InvalidType", { expected: "String", received: (typeof blockType) });

    const content = String(text);
    let type = String(blockType).trim().toLowerCase();

    const output = `\`\`\`${type}\n${content}\`\`\``;

    return output;
  };

  translate(fkey = null, locate = "en-US") {
    if (!checker.check(fkey).isString()) checker.error("key", "InvalidType", { expected: "String", received: (typeof key) });
    if (!checker.check(locate).isString()) checker.error("locate", "InvalidType", { expected: "String", received: (typeof locate) });

    const key = String(fkey).trim();

    let result = null;

    if (this.loader.languages.has(locate)) {
      const translations = this.loader.languages.get(locate).translations;

      const object = new Object(translations);

      result = String(get(object, key));
    };

    return result;
  };

  async pagination(interaction = null, { embeds = [], buttons = [] }) {
    if (!checker.check(interaction).isObject()) checker.error("interaction", "InvalidType", { expected: "Object", received: (typeof interaction) });

    if (!checker.check(embeds).isArray()) checker.error("embeds", "InvalidType", { expected: "Array", received: (typeof embeds) });
    if (!checker.check(buttons).isArray()) checker.error("buttons", "InvalidType", { expected: "Array", received: (typeof buttons) });

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
  };

  static version = "v1.0.3";
};