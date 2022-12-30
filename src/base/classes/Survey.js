import {
  EmbedBuilder as Embed,
  ButtonBuilder as Button,
  ActionRowBuilder as Row,
  ButtonStyle as Style
} from "discord.js";

import { Data } from "./../../config/export.js";

import { Structure } from "../structures/export.js";
const dbs = new Structure().databases;

export class Survey {
  constructor(client = null, interaction = null, config = Data, options = { database: dbs.subscribe }) {
    const { database } = options;

    this.database = database;
    this.client = client;
    this.interaction = interaction;
    this.config = config;
  };

  async create(channel, options = { description: null, mention: null }) {
    const { description, mention } = options;
    const surveyChannel = this.client.channels.resolve(channel.id);

    const total = this.database.add(`Guild_${this.interaction.guild.id}.Surveys.Total`, 1);

    const embed = new Embed({
      title: `${this.client.user.username} - Survey | No #${total}`,
      description,
      footer: { text: `Created by ${this.interaction.user?.tag}`, iconURL: this.interaction.user?.avatarURL() },
      thumbnail: { url: this.interaction.guild?.iconURL() }
    }).setColor("Random").setTimestamp();

    const emojiUp = this.client.emojis.resolve("1031179456917803100");
    const emojiDown = this.client.emojis.resolve("1031178994743267368");

    const buttons = {
      up: new Button({
        style: Style.Secondary,
        customId: `survey_${this.interaction.guild.id}-${total}-up`,
        label: "Up (0)",
        emoji: { id: emojiUp.id, name: emojiUp.name, animated: emojiUp.animated }
      }),

      down: new Button({
        style: Style.Secondary,
        customId: `survey_${this.interaction.guild.id}-${total}-down`,
        label: "Down (0)",
        emoji: { id: emojiDown.id, name: emojiDown.name, animated: emojiDown.animated }
      })
    };

    const row = new Row({ components: [buttons.up, buttons.down] });

    await interaction.reply({ content: `${this.config.Emoji.State.SUCCESS} Survey Created! (ID: ${total})`, ephemeral: true });
    return surveyChannel.send({ content: mention ? mention : null, embeds: [embed], components: [row] }).then((message) => {
      this.database.push(`Guild_${this.interaction.guild.id}.Surveys.List`, { message: message.id, channel: channel.id, employee: this.interaction.user.id, id: total });
      this.database.set(`Guild_${this.interaction.guild.id}.Surveys.Survey-${total}`, { message: message.id, channel: channel.id, guild: message.guild.id, employee: this.interaction.user?.id, Votes: { UP: 0, DOWN: 0 } });
    });
  };

  delete(surveyNo = 0) {
    let body = {
      no: null,
      channel: null
    };

    return this.database.fetch(`Guild_${this.interaction.guild.id}.Surveys.List`)?.map(async (survey) => {
      const surveyData = this.database.fetch(`Guild_${this.interaction.guild.id}.Surveys.Survey-${survey.id}`);
      const { message, channel, employee, guild } = surveyData;

      console.log(surveyNo === Number(survey.id))
      if (surveyNo === Number(survey.id)) {
        console.log("a")
        this.database.pull(`Guild_${this.interaction.guild.id}.Surveys.List`, (data) => data.id === survey.id);
        this.database.del(`Guild_${this.interaction.guild.id}.Surveys.Survey-${survey.id}`);
        this.database.sub(`Guild_${this.interaction.guild.id}.Surveys.Total`, 1);

        const surveyMessage = await this.client.channels.cache.get(channel).messages.fetch(message);
        return surveyMessage.delete().then(() => {
          console.log(`Survey ${survey.id} deleted. (${this.client.guilds.resolve(guild).name})`);

          body.no = survey.id;
          body.channel = channel;
        }).catch((err) => console.log(err));
      };

      return body;
    });
  };
};