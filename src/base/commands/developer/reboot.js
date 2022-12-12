import { Command } from "../../structures/export.js";

import { Loader } from "../../classes/Loader/Loader.js";


export default class extends Command {
  constructor() {
    super({
      enabled: true,
      mode: "Developer"
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

        await Promise.all(loader.commands.cache.map((command_) => loader.commands.cache.delete(command_.data.name)));

        loader.once("commandsReady", (message, commands) => {
          console.log(message);

          this.client.REST.put([]);
          this.client.REST.put(commands);

          return interaction.editReply(`${this.config.Emoji.State.SUCCESS} Rebooted commands.`);
        });

        return await loader.CommandSetup();
      } else if (command === "events") {
        await interaction.reply(`${this.config.Emoji.State.LOADING} Rebooting events.`);

        await Promise.all(loader.events.cache.map((event) => loader.commands.cache.delete(event.name)));

        loader.once("eventsReady", (message) => {
          console.log(message);

          return interaction.editReply(`${this.config.Emoji.State.SUCCESS} Rebooted events.`);
        });

        return await loader.EventSetup();
      } else if (command === "handlers") {
        await interaction.reply(`${this.config.Emoji.State.LOADING} Rebooting handlers.`);

        await Promise.all(loader.handlers.cache.map((handler) => loader.handlers.cache.delete(handler.name)));

        loader.once("handlersReady", (message) => {
          console.log(message);

          return interaction.editReply(`${this.config.Emoji.State.SUCCESS} Rebooted handlers.`);
        });

        return await loader.HandlerSetup();
      };
    };
  };
};