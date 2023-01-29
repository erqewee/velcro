import { Command } from "../../structures/export.js";

export default class extends Command {
  constructor() {
    super({ enabled: true, mode: "Global" });

    this.setCommand(new this.SlashCommand()
      .setName("ping")
      .setDescription("Pong!")
    );
  };

  async execute({ interaction, member, guild, options }) {
    let message;
    let channel;

    function loop(messageID, channelID) {
      const api = this.client.ws.ping;
      const bot = Math.round(Date.now() - interaction.createdTimestamp);

      const green = this.config.Emoji.Ping.GREEN;
      const orange = this.config.Emoji.Ping.ORANGE;
      const red = this.config.Emoji.Ping.RED;
      const blue = this.config.Emoji.Ping.BLUE;
      const yellow = this.config.Emoji.Ping.YELLOW;

      let api_status = green;
      let bot_status = green;

      if (api > 100 && api < 200) api_status = blue;
      else if (api > 200 && api < 400) api_status = orange;
      else if (api > 800 && api < 1600) api_status = yellow;
      else if (api > 1600) api_status = red;

      if (bot > 100 && bot < 200) bot_status = blue;
      else if (bot > 200 && bot < 400) bot_status = orange;
      else if (bot > 800 && bot < 1600) bot_status = yellow;
      else if (bot > 1600) bot_status = red;

      const embed = new this.Embed({
        title: `${this.client.user.username} - Ping`,
        fields: [
          {
            name: `${this.config.Emoji.Other.TIME} API Ping`,
            value: `${api_status} \`${api}ms\``,
            inline: true
          },
          {
            name: `${this.config.Emoji.Other.TIME} Bot Ping`,
            value: `${bot_status} \`${bot}ms\``,
            inline: true
          }
        ],
        thumbnail: { url: member?.displayAvatarURL() },
        footer: { iconURL: guild?.iconURL() }
      })
        .setColor("Random")
        .setTimestamp();

      if (!messageID) return interaction.reply({ embeds: [ embed ], fetchReply: true }).then((m) => {
        message = m.id;
        channel = m.channel.id;
      });
      else return setInterval(async () => {
        const data = await (await this.client.channels.fetch(channelID)).messages.fetch(messageID);
        data.edit({ embeds: [ embed ] });
      }, 7000);
    };

    loop(message, channel);
  };
};