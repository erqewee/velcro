import { Command } from "../../structures/export.js";

import { Loader } from "../../classes/Loader/Loader.js";

export default class extends Command {
  constructor() {
    super({ enabled: true, mode: "Developer" });

    this.setCommand(new this.SlashCommand()
      .setName("reboot")
      .setDescription("Manage bot status.")
      .addSubcommand((c) => c.setName("bot").setDescription("Reboot bot."))
      .addSubcommand((c) => c.setName("commands").setDescription("Reload available commands."))
      .addSubcommand((c) => c.setName("events").setDescription("Reload available events."))
      .addSubcommand((c) => c.setName("handlers").setDescription("Reload available handlers."))
    );

    this.setPermissions("Administrator")
  };

  async execute({ interaction, member, channel, guild, options, command }) {
    const db = this.databases.general;

    const loader = new Loader(this.client, []);

    if (command === "bot") {
      await interaction.reply({ content: `${this.config.Emoji.State.LOADING} Rebooting`, fetchReply: true }).then((m) => process.send({ request: 0, channel: m.channel.id, message: m.id }));

      process.exit(0);
    } else if (command === "commands") {
      await interaction.reply(`${this.config.Emoji.State.LOADING} Rebooting commands.`);

      const keys = loader.commands.keys();

      for (let index = 0; index < loader.commands.size; index++) loader.commands.delete(keys[index]);

      loader.once("commandsReady", async (commands) => {
        await this.client.REST.PUT([]);
        await this.client.REST.PUT(commands);

        return interaction.editReply(`${this.config.Emoji.State.SUCCESS} Rebooted commands.`);
      });

      return await loader.Command();
    } else if (command === "events") {
      await interaction.reply(`${this.config.Emoji.State.LOADING} Rebooting events.`);

      const keys = loader.events.keys();

      for (let index = 0; index < loader.events.size; index++) loader.events.delete(keys[index]);

      loader.once("eventsReady", () => interaction.editReply(`${this.config.Emoji.State.SUCCESS} Rebooted events.`));

      return await loader.Event();
    } else if (command === "handlers") {
      await interaction.reply(`${this.config.Emoji.State.LOADING} Rebooting handlers.`);

      const keys = loader.handlers.keys();

      for (let index = 0; index < loader.handlers.size; index++) loader.handlers.delete(keys[index]);

      loader.once("handlersReady", () => interaction.editReply(`${this.config.Emoji.State.SUCCESS} Rebooted handlers.`));

      return await loader.Handler();
    };
  };
};