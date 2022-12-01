import { Command } from "../../structures/export.js";

import { Loader } from "../../classes/Loader/Loader.js";


export default class extends Command {
  constructor() {
    super({
      enabled: true,
      support: false,
      isDev: true
    });

    this.setCommand(new this.SlashCommand()
      .setName("reboot")
      .setDescription("Manage bot status.")
      .addSubcommand((c) => c.setName("commands").setDescription("Reload available commands."))
      .addSubcommand((c) => c.setName("events").setDescription("Reload available events."))
      .addSubcommand((c) => c.setName("handlers").setDescription("Reload available handlers."))
    );

    this.execute = async function ({ interaction, member, channel, guild, options }) {
      const command = options.getSubcommand(false);

      const loader = new Loader(this.client, []);

      if (command === "commands") {
        await interaction.reply(`${this.config.Emoji.State.LOADING} Rebooting commands.`);

        await Promise.all(loader.commands.cache.map((command_) => {
          return loader.commands.cache.delete(command_.data.name);
        }));

        loader.on("commandsReady", (message) => console.log(message));

        return loader.CommandSetup().then(() => {
          return interaction.editReply(`${this.config.Emoji.State.SUCCESS} Rebooted commands.`);
        });
      } else if (command === "events") {
        await interaction.reply(`${this.config.Emoji.State.LOADING} Rebooting events.`);

        console.log("a")

        await Promise.all(loader.events.cache.map((event) => {
          return loader.commands.cache.delete(event.name);
        }));

        loader.on("eventsReady", (message) => console.log(message));

        return loader.EventSetup().then(() => {
          return interaction.editReply(`${this.config.Emoji.State.SUCCESS} Rebooted events.`);
        });
      } else if (command === "handlers") {
        await interaction.reply(`${this.config.Emoji.State.LOADING} Rebooting handlers.`);

        await Promise.all(loader.handlers.cache.map((handler) => {
          return loader.handlers.cache.delete(handler.name);
        }));

        loader.on("handlersReady", (message) => console.log(message));

        return loader.HandlerSetup().then(() => {
          return interaction.editReply(`${this.config.Emoji.State.SUCCESS} Rebooted handlers.`);
        });
      };
    };
  };
};