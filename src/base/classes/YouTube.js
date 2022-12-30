import Parser from "rss-parser";
import Converter from "rss-converter";
const parser = new Parser();

import {
  EmbedBuilder as Embed,
  ButtonBuilder as Button,
  ButtonStyle as Style,
  ActionRowBuilder as Row
} from "discord.js";

import { Structure } from "../structures/export.js";
const dbs = new Structure().databases;

export class YouTube {
  constructor(client = null, channelID = null, database = dbs.subscribe) {
    this.channel = channelID;
    this.database = database;
    this.client = client;
  };

  async getLastVideos() {
    const storage = [];

    (await Converter.toJson(`https://www.youtube.com/feeds/videos.xml?channel_id=${this.channel}`)).items.map((val) => {
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
        BUTTON: new Row({
          components: [
            new Button({
              style: Style.Link,
              label: "YouTube'da İzle",
              url: `https://youtu.be/${CODE}`
            })
          ]
        })
      });
    });

    return storage;
  };

  async checkUploads() {
    const client = this.client;

    const postedVideos = this.database.fetch("Subscribe.Settings.Videos.Posted");
    const lastVideo = this.database.fetch("Subscribe.Settings.Videos.Last");

    const embeds = [];
    const components = [];

    let lastVideoURL = null;
    let newVideo = false;
    let video = null;

    const youtube = client.emojis.resolve("1043508725295616042");

    await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${this.channel}`).then((data) => {
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

      if (!String(this.database.fetch("Subscribe.Settings.Videos.Posted")[0]?.LINK).includes(video.LINK)) this.database.push("Subscribe.Settings.Videos.Posted", video);

      lastVideoURL = `https://youtu.be/${CODE}`;

      if (String(lastVideo).includes(lastVideoURL)) return;

      newVideo = true;
      lastVideoURL = `https://youtu.be/${CODE}`;

      this.database.push("Subscribe.Settings.Videos.Posted", video);
      this.database.set("Subscribe.Settings.Videos.Last", lastVideoURL);

      embeds.push(new Embed({
        title: `${video.TITLE}`,
        description: `**[${video.AUTHOR}](https://youtube.com/channel/${this.channel})** Yeni bir video yükledi! İlk izleyenlerden ol!`,
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
      sendAnnounce: function (channelID) {
        newVideo ? client.channels.resolve(channelID).send({
          embeds,
          components,
          content: `<t:${this.video.PUBLISHED_DATE}:R>`
        }) : null;
      }
    };
  };

  static Parser = new Parser();
};