import { Command } from "../../structures/export.js";


export default class extends Command {
  constructor() {
    super({ enabled: false, mode: "Global" });

    this.setCommand(new this.SlashCommand()
      .setName("ticket")
      .setDescription("Manage ticket system.")
      .addSubcommand((c) => c.setName("setup").setDescription("Setup ticket system."))
    );

    // THIS COMMAND NOT COMPLETED, DON'T TOUCH!!!
    // THIS COMMAND NOT COMPLETED, DON'T TOUCH!!!
    // THIS COMMAND NOT COMPLETED, DON'T TOUCH!!!
    // THIS COMMAND NOT COMPLETED, DON'T TOUCH!!!
    // THIS COMMAND NOT COMPLETED, DON'T TOUCH!!!
  };

  async execute({ interaction, member: m, channel, guild: g, options, command: c }) {
    const db = this.databases.general;

    if (c === "setup") {
      await interaction.reply({ content: `${this.config.Emoji.State.LOADING} Ticket system creating, Please wait a few seconds.` });

      if(db.fetch)
      
      g.channels.create({
        name: "Ticket System",
        type: this.ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: g.id,
            deny: [this.Permissions.ViewChannel]
          }
        ]
      }).then((category) => {
        g.channels.create({ name: 'ticket-log', type: this.ChannelType.GuildText, parent: category.id }).then((channel) => {
          return db.set(`Guild_${channel.guild.id}.Ticket.Log`, channel.id);
        });

        return interaction.editReply({ content: `${this.config.Emoji.State.SUCCESS} Ticket system ready.` });
      });
    };
  };
};