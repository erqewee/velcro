import Parser from "rss-parser";
import Converter from "rss-converter";
const parser = new Parser();

import {
  EmbedBuilder as Embed,
  ButtonBuilder as Button,
  ButtonStyle as Style,
  ActionRowBuilder as Row
} from "discord.js";

export class YouTube {
  constructor(client, options = {
    database: null,
    YouTube: {
      channelID: null,
      userID: null
    }
  }) {
    const { channelID, userID } = options.YouTube;
    const { database } = options;

    this.getLastVideos = async function () {
      const storage = [];

      (await Converter.toJson(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelID}`)).items.map((val) => {
        const CODE = val.yt_videoId;

        storage.push({
          TITLE: val.media_group.media_title,
          AUTHOR: val.author.name,
          LINK: `https://youtu.be/${CODE}`,
          PUBLISHED_DATE: Math.floor(new Date(val.published ?? 0).getTime() / 1000),
          CODE: CODE,
          THUMBNAIL: val.media_group.media_thumbnail_url,
          LIKES: {
            TOTAL: val.media_group.media_community.media_starRating_count,
            AVERAGE: val.media_group.media_community.media_starRating_average
          },
          VIEWS: val.media_group.media_community.media_statistics_views,
          BUTTON: new Row({ components: [
            new Button({
              style: Style.Link,
              label: "YouTube'da İzle",
              url: `https://youtu.be/${CODE}`
            })
          ]})
        });
      });

      return storage;
    };

    this.checkUploads = async function () {
      if (!database.fetch("Subscribe.Settings.Videos.Posted")) database.set("Subscribe.Settings.Videos.Posted", []);

      const postedVideos = database.fetch("Subscribe.Settings.Videos.Posted");
      const lastVideo = database.fetch("Subscribe.Settings.Videos.Last");

      const embeds = [];
      const components = [];

      let lastVideoURL = null;
      let newVideo = false;
      let video = null;

      const youtube = client.emojis.resolve("1043508725295616042");

      await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelID}`).then((data) => {
        const CODE = String(String(data.items[0].link).split("=")[1]);
        const DATE = Math.floor(new Date(data.items[0].pubDate || 0).getTime() / 1000);

        video = {
          LINK: String(data.items[0].link),
          TITLE: String(data.items[0].title),
          AUTHOR: String(data.items[0].author),
          PUBLISHED_DATE: DATE,
          CODE: CODE,
          THUMBNAIL: `https://img.youtube.com/vi/${CODE}/hqdefault.jpg`
        };

        lastVideoURL = `https://youtu.be/${CODE}`;

        if (String(lastVideo).includes(lastVideoURL)) return;

        newVideo = true;
        lastVideoURL = `https://youtu.be/${CODE}`;

        database.push("Subscribe.Settings.Videos.Posted", { TITLE: video.TITLE, LINK: video.LINK, CODE: CODE, DATE: DATE });
        database.set("Subscribe.Settings.Videos.Last", lastVideoURL);

        embeds.push(new Embed({
          title: `${video.TITLE}`,
          description: `**${video.AUTHOR}** Yeni bir video yükledi! İlk izleyenlerden ol!`,
          image: {
            url: video.THUMBNAIL
          }
        }).setColor("Random"));

        components.push(new Row({
          components: [
            new Button({
              style: Style.Link,
              label: "YouTube",
              emoji: { name: youtube.name, id: youtube.id, animated: youtube.animated },
              url: lastVideoURL
            })
          ]
        }))
      });

      return {
        embeds: embeds,
        components: components,
        lastVideoURL: lastVideoURL,
        video: video,
        videoCode: postedVideos[0]?.CODE,
        newVideoPosted: newVideo,
        sendAnnounce: async function (channelID) {
          newVideo ? (await client.channels.resolve(channelID)).send({
            embeds,
            components,
            content: `<t:${this.video.PUBLISHED_DATE}:R>`
          }) : null;
        }
      };
    };
  };

  static Parser = new Parser();
};