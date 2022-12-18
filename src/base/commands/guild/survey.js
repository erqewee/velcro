import { Command } from "../../structures/export.js";

import { Survey } from "../../classes/Survey.js";

const choices = [
  {
    name: "@here",
    value: "@here"
  },
  {
    name: "@everyone",
    value: "@everyone"
  }
];

export default class extends Command {
  constructor() {
    super({ enabled: false, mode: "Global" });

    this.setCommand(new this.SlashCommand()
      .setName("survey")
      .setDescription("Manage surveys for guild.")
      .addSubcommand((c) =>
        c.setName("create")
          .setDescription("Create new survey.")
          .addChannelOption((o) => o.setName("channel").setDescription("Set channel for a new survey.").setRequired(true).addChannelTypes(0))
          .addStringOption((o) => o.setName("description").setDescription("Set survey description.").setRequired(true).setMinLength(8).setMaxLength(4095))
          .addStringOption((o) => o.setName("mention").setDescription("Select Mention in content.").addChoices(...choices))
      )
      .addSubcommand((c) =>
        c.setName("delete")
          .setDescription("Delete survey.")
          .addNumberOption((o) => o.setName("no").setDescription("Survey no.").setRequired(true))
      )
    );

    this.execute = async function ({ interaction, member: m, channel: c, guild: g, options }) {
      const db = this.databases.general;

      const survey = new Survey(this.client, interaction, this.config, { database: db });

      const command = options.getSubcommand(false);

      if (command === "create") {
        const channel = this.channels.cache.get(options.getChannel("channel").id);
        const description = options.getString("description");
        const mention = options.getString("mention") ?? null;

        return survey.create(channel, { description, mention });
      } else if(command === "delete") {
        const surveyNo = String(options.getNumber("no"));

        return survey.delete(surveyNo);
      };
    };
  };
};