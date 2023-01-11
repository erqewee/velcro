import { Command } from "../../structures/export.js";

export default class extends Command {
  constructor() {
    super({ enabled: false, mode: "Global" });

    this.setCommand(new this.SlashCommand()
      .setName("blocker")
      .setDescription("Manage guild blocker system.")

      .addSubcommand((c) =>
        c.setName("all")
          .setDescription("Enable all blockers.")
          .addBooleanOption((o) => o.setName("state").setDescription("Enable (true), Disable (false)"))
      )
      .addSubcommand((c) =>
        c.setName("ads")
          .setDescription("Enable ad blocker.")
          .addBooleanOption((o) => o.setName("state").setDescription("Enable (true), Disable (false)"))
      )
      .addSubcommand((c) =>
        c.setName("swears")
          .setDescription("Enable swear blocker.")
          .addBooleanOption((o) => o.setName("state").setDescription("Enable (true), Disable (false)"))
      )
      .addSubcommand((c) =>
        c.setName("attachments")
          .setDescription("Enable attachment blocker.")
          .addBooleanOption((o) => o.setName("state").setDescription("Enable (true), Disable (false)"))
      )
    );

    // THIS COMMAND NOT COMPLETED (Did you complete this command? You can open a "Pull Request" on GitHub.)
    // THIS COMMAND NOT COMPLETED (Did you complete this command? You can open a "Pull Request" on GitHub.)
    // THIS COMMAND NOT COMPLETED (Did you complete this command? You can open a "Pull Request" on GitHub.)
    // THIS COMMAND NOT COMPLETED (Did you complete this command? You can open a "Pull Request" on GitHub.)

  };

  async execute({ interaction, member: m, channel, guild: g, options, command: c }) {
    const db = this.databases.general;

    if (c === "all") {
      await interaction.reply({ content: `${this.config.Emoji.State.LOADING} Enabling all systems. Please wait a few seconds.` });

      if (db.has(`Guild_${g.id}.Blockers.Ads`) && db.has(`Guild_${g.id}.Blockers.Swears`) && db.has(`Guild_${g.id}.Blockers.Attachments`)) return interaction.editReply({ content: `${this.config.Emoji.State.ERROR} Systems already Enabled.` });

      db.set(`Guild_${g.id}.Blockers.Ads`, true);
      db.set(`Guild_${g.id}.Blockers.Swears`, true);
      db.set(`Guild_${g.id}.Blockers.Attachments`, true);

      return interaction.editReply({ content: `${this.config.Emoji.State.LOADING} Enabled all systems.` });
    } else if (c === "ads") {
      await interaction.reply({ content: `${this.config.Emoji.State.LOADING} Enabling system. Please wait a few seconds.` });

      db.set(`Guild_${g.id}.Blockers.Ads`, true);

      return interaction.editReply({ content: `${this.config.Emoji.State.LOADING} Enabled all systems.` });
    }
  };
};