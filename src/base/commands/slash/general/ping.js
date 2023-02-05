import { SlashCommand } from "../../../structures/export.js";

export default class extends SlashCommand {
  constructor() {
    super({ enabled: true, mode: "Global" });

    this.setCommand(new this.SlashCommand()
      .setName("ping")
      .setDescription("Pong!")
    );
  };

  async execute({ interaction, member, guild, options }) {
    // how to create javascript function?
    
    const client = this.client;
    const config = this.config;

    const Embed = this.Embed;

    function get(time) {
      const green = config.Emoji.Ping.GREEN;
      const orange = config.Emoji.Ping.ORANGE;
      const red = config.Emoji.Ping.RED;
      const blue = config.Emoji.Ping.BLUE;
      const yellow = config.Emoji.Ping.YELLOW;

      const api = client.ws.ping;
      const bot = Math.round(Date.now() - time);

      let api_status = green;
      let bot_status = green;

      if (api >= 150 && api < 300) api_status = blue;
      else if (api >= 300 && api < 600) api_status = orange;
      else if (api >= 600 && api < 1200) api_status = yellow;
      else if (api >= 1200) api_status = red;

      if (bot >= 150 && bot < 300) bot_status = blue;
      else if (bot >= 300 && bot < 600) bot_status = orange;
      else if (bot >= 600 && bot < 1200) bot_status = yellow;
      else if (bot >= 1200) bot_status = red;

      const embed = new Embed({
        title: `${client.user.username} - Ping`,
        fields: [
          {
            name: `${config.Emoji.Other.TIME} API Ping`,
            value: `${api_status} \`${api}ms\``,
            inline: true
          },
          {
            name: `${config.Emoji.Other.TIME} Bot Ping`,
            value: `${bot_status} \`${bot}ms\``,
            inline: true
          }
        ],
        thumbnail: { url: guild?.iconURL() },
        footer: { iconURL: member?.displayAvatarURL() }
      })
        .setColor("Random")
        .setTimestamp();

      return embed;
    };

    return interaction.reply({ embeds: [ get(interaction.createdTimestamp) ] });
  };
};