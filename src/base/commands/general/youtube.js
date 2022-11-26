import { Command } from "../../structures/export.js";

import { YouTube } from "../../classes/YouTube.js";

const choices = [
  {
    name: "SkyLegend",
    value: "UCjtU9nHOAo6XpJCF9qb-1Ow"
  }
];

export default class extends Command {
  constructor() {
    super({
      enabled: true,
      support: false
    });

    this.setCommand(new this.SlashCommand()
      .setName("youtube")
      .setDescription("Get information about provided channel.")
      .addSubcommand((c) =>
        c.setName("videos")
          .setDescription("Get video information about provided channel.")
          .addStringOption((o) => o.setName("channel").setDescription("Provide channel.").addChoices(choices[0]).setRequired(true))
      )
      .addSubcommand((c) =>
        c.setName("last")
          .setDescription("Get last video for provided channel.")
          .addStringOption((o) => o.setName("channel").setDescription("Provide channel.").addChoices(choices[0]).setRequired(true))
      )
    );

    this.execute = async function ({ interaction, member, channel, guild, options }) {
      const channelID = options.getString("channel");
      const youtube = new YouTube(this.client, { YouTube: { channelID: channelID } });

      const command = options.getSubcommand(false);

      if (command === "videos") {
        await interaction.reply({ embeds: [new this.Embed({ description: `${this.config.Emoji.State.LOADING} Veriler yükleniyor...` })] });

        const videos = await youtube.getLastVideos();

        const buttons = [];
        const embeds = [];

        await Promise.all(videos.map(async (video, _index) => {
          const INDEX = (_index + 1);

          await interaction.editReply({
            embeds: [new this.Embed({
              title: `${this.client.user.username} - YouTube | Sıralama Yükleniyor`,
              description: `${this.config.Emoji.State.LOADING} ${video.TITLE}`,
              fields: [
                {
                  name: `${this.config.Emoji.Other.INFINITE} Tamamlanan`,
                  value: `- \`${INDEX}\``,
                  inline: true
                },
                {
                  name: `${this.config.Emoji.Other.ACTIVITY} Kalan`,
                  value: `- \`${videos.length - INDEX}\``,
                  inline: true
                },
                {
                  name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
                  value: `- <t:${video.PUBLISHED_DATE}:R>`,
                  inline: true
                },
                {
                  name: `${this.config.Emoji.Other.INFINITE} Görüntülenme`,
                  value: `- \`${video.VIEWS}\``,
                  inline: true
                },
                {
                  name: `${this.config.Emoji.Other.FIRE} Beğenme`,
                  value: `- \`${video.LIKES.TOTAL}\``,
                  inline: true
                }
              ],
              image: {
                url: video.THUMBNAIL
              }
            })
            ]
          });

          embeds.push(new this.Embed({
            title: `${this.client.user.username} - YouTube | Sıralama #${INDEX}`,
            url: video.LINK,
            description: `${video.TITLE}`,
            image: {
              url: video.THUMBNAIL
            },
            fields: [
              {
                name: `${this.config.Emoji.Other.ADMIN} Yükleyen`,
                value: `- ${video.AUTHOR}`,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
                value: `- <t:${video.PUBLISHED_DATE}:R>`,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.INFINITE} Görüntülenme`,
                value: `- \`${video.VIEWS}\``,
                inline: false
              },
              {
                name: `${this.config.Emoji.Other.FIRE} Beğenme`,
                value: `- \`${video.LIKES.TOTAL}\``,
                inline: true
              }
            ]
          }));

          return buttons.push(video.BUTTON);
        }));

        return await this.pagination(interaction, { embeds, buttons });
      } else if (command === "last") {
        const video = (await youtube.getLastVideos())[0];

        const embed = new this.Embed({
          title: `${this.client.user.username} - YouTube | Son Video`,
          url: video.LINK,
          description: `${video.TITLE}`,
          fields: [
            {
              name: `${this.config.Emoji.Other.ADMIN} Yükleyen`,
              value: `- ${video.AUTHOR}`,
              inline: true
            },
            {
              name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
              value: `- <t:${video.PUBLISHED_DATE}:R>`,
              inline: true
            },
            {
              name: `${this.config.Emoji.Other.INFINITE} Görüntülenme`,
              value: `- \`${video.VIEWS}\``,
              inline: false
            },
            {
              name: `${this.config.Emoji.Other.FIRE} Beğenme`,
              value: `- \`${video.LIKES.TOTAL}\``,
              inline: true
            }
          ],
          image: {
            url: video.THUMBNAIL
          }
        });

        return interaction.reply({ embeds: [embed] });
      };
    };
  };
};