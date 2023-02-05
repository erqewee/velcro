import { SlashCommand } from "../../../structures/export.js";

import { fetch, FetchMethods as Methods, FetchResultTypes as Types } from "@sapphire/fetch";

import { CacheManager } from "../../../CacheManager.js";

const cache = new CacheManager();

export default class extends SlashCommand {
  constructor() {
    super({ enabled: false, mode: "Global" });

    this.setCommand(new this.SlashCommand()
      .setName("npm")
      .setDescription("Search NPM Module.")
      .addStringOption((o) => o.setName("name").setDescription("Module name.").setRequired(true))
    );

    // THIS COMMAND NOT COMPLETED, DON'T TOUCH.
    // THIS COMMAND NOT COMPLETED, DON'T TOUCH.
    // THIS COMMAND NOT COMPLETED, DON'T TOUCH.
    // THIS COMMAND NOT COMPLETED, DON'T TOUCH.
    // THIS COMMAND NOT COMPLETED, DON'T TOUCH.
    // THIS COMMAND NOT COMPLETED, DON'T TOUCH.
  };

  async execute({ interaction, member, channel, guild, options }) {
    const name = String(options.getString("name")).toLowerCase();

    await interaction.reply({ content: `${this.config.Emoji.State.LOADING} Searching...` });

    const npm = await fetch(`https://registry.npmjs.org/${name}`, { method: Methods.Get }, Types.JSON);

    const embeds = [];

    await Promise.all(Object.keys(npm.time).map(async (key) => {
      const dependencies = [];

      if (key === "created" && key === "modified") return;

      const version = npm.versions[ key ];

      await Promise.all(Object.keys(version.dependencies).map((depend) => dependencies.push(depend)));


    }));

    const latest_version = npm[ "dist-tags" ]?.latest;
    const dev_version = npm[ "dist-tags" ]?.dev;

    embeds.push(new this.Embed({
      title: `${this.client.user.username} - NPM Results | ${name}`,
      description: `Use buttons to control.`
    }));
  };
};