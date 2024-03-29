import { SlashCommand } from "../../../structures/export.js";

export default class extends SlashCommand {
  constructor() {
    super({ enabled: true, mode: "Global" });

    this.setCommand(new this.SlashCommand()
      .setName("register")
      .setDescription("Manage register system.")
      .addSubcommand((c) =>
        c.setName("set")
          .setDescription("Setup register system.")
          .addChannelOption((o) => o.setName("channel").setDescription("Enter register channel.").addChannelTypes(0).setRequired(true))
          .addRoleOption((o) => o.setName("employee-role").setDescription("Set employee role.").setRequired(true))
          .addRoleOption((o) => o.setName("unregistered-role").setDescription("Set unregistered role.").setRequired(true))
          .addRoleOption((o) => o.setName("bot-role").setDescription("Set unregistered role.").setRequired(true))
          .addRoleOption((o) => o.setName("member-role").setDescription("Set member role.").setRequired(true))
          .addStringOption((o) => o.setName("unregistered-name").setDescription("Enter unregistered display name.").setMinLength(5).setMaxLength(30).setRequired(true))
      )
    );
  };

  async execute({ interaction, member: m, channel, guild, options }) {
    const db = this.databases.general;

    const command = options.getSubcommand(false);

    if (command === "set") {
      const employee = options.getRole("employee-role").id;
      const channel = options.getChannel("channel").id;
      const unregistered = options.getRole("unregistered-role").id;
      const bot = options.getRole("bot-role").id;
      const member = options.getRole("member-role").id;
      const unregistered_name = options.getString("unregistered-name");

      db.set(`Guild_${guild.id}.Settings.Register`, {
        Employee: employee,
        Channel: channel,
        Unregistered: unregistered,
        UnregisteredName: unregistered_name,
        Bot: bot,
        Member: member
      });

      return interaction.reply({ content: `${this.config.Emoji.State.SUCCESS} Başarılı!`, ephemeral: true });
    };
  };
};