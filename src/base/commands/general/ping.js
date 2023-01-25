import { Command } from "../../structures/export.js";

export default class extends Command {
  constructor() {
    super({ enabled: true, mode: "Global" });

    this.setCommand(new this.SlashCommand()
      .setName("ping")
      .setDescription("Pong!")
    );
  };

  async execute({ interaction, member, channel, guild, options }) {
    //this.client.cluster.fetchClientValue("guilds.cache.size").then((count) => console.log(`${count} / ${this.client.cluster.id}`));
    const embed = new this.Embed({
      title: `${this.client.user.username} - Ping`,
      description: `Cluster ID: **${this.client.cluster.id}** \nShard ID: **${interaction.guild.shardId}**`,
      fields: [
        {
          name: `${this.config.Emoji.Other.TIME} API Ping`,
          value: `- \`${this.client.ws.ping}ms\``
        },
        {
          name: `${this.config.Emoji.Other.TIME} Bot Ping`,
          value: `- \`${Math.round(Date.now() - interaction.createdTimestamp)}ms\``,
          inline: false
        }
      ],
      thumbnail: { url: member?.displayAvatarURL() },
      footer: { iconURL: guild?.iconURL() }
    })
      .setColor("Random")
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  };
};