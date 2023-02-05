import { SlashCommand } from "../../../structures/export.js";

import { Player } from "../../../export.js";

export default class extends SlashCommand {
  constructor() {
    super({ enabled: true, mode: "Global" });

    this.setCommand(new this.SlashCommand()
      .setName("music")
      .setDescription("Music commands.")
      .addSubcommand((c) => c.setName("play").setDescription("Play music in voice channel.").addStringOption((o) => o.setName("query").setDescription("Music name for play.").setRequired(true)))
      .addSubcommand((c) => c.setName("stop").setDescription("Stop music."))
    );
  };

  async execute({ interaction, member, guild, channel, options, command: c }) {
    const player = new Player(this.client);

    const voiceChannel = member.voice.channel;
    const botChannel = guild.members.me.voice;

    if (c === "play") {
      const query = options.getString("query");

      await interaction.deferReply();

      if (!voiceChannel) return await interaction.editReply({ content: `${this.config.Emoji.State.ERROR} To play music, you should enter a voice channel!` });
      if (!voiceChannel.id == botChannel.channelId) return await interaction.editReply({ content: `${this.config.Emoji.State.ERROR} You're not on the channel I'm in.` });

      player.on("playSong", async (queue, song) => {
        const row = new this.Row({
          components: [
            new this.Button({
              style: this.ButtonStyle.Link,
              label: "URL",
              url: song.url ?? "https://discord.com",
              disabled: song?.url ? false : true
            })
          ]
        });

        function getPlatform(base) {
          const source = String(base.source).toLowerCase();

          let thumbnail = null;
          if (source === "youtube") thumbnail = "https://cdn.discordapp.com/emojis/1069240507605188608.webp?size=1024&quality=lossless";
          else if (source === "spotify") thumbnail = "https://cdn.discordapp.com/emojis/1069240481399189564.webp?size=1024&quality=lossless"

          return thumbnail;
        };

        const embed = new this.Embed();
        embed.setTitle(`${this.client.user.username} - Music | Play`)
          .setDescription(`
        \`Name:\` **${song.name}**
        \`Duration:\` **${song.formattedDuration}**

        \`Views:\` **${song.views}**
        \`Likes:\` **${song.likes}**
        \`Dislikes:\` **${song.dislikes}**
        `)
          .setImage(song.thumbnail)
          .setFooter({ text: `Uploaded by '${song.uploader.name}'` })
          .setThumbnail(getPlatform(song))
          .setTimestamp()
          .setColor("Random");

        const relateds = [];
        const relatedData = [];

        const relatedSongs = new this.StringMenu({
          customId: "relatedSongs",
          placeholder: "Related Songs",
          maxValues: 1,
          minValues: 1
        });

        const getEmoji = this.emojis.cache.get("1069233433366249593");
        const emoji = { animated: getEmoji.animated, id: getEmoji.id, name: getEmoji.name };

        for (let index = 0; index < 5; index++) {
          const related = song.related[ index ];

          relateds.push({
            label: `Top #${index + 1}`,
            description: `Recommended (By '${related.uploader.name}')`,
            emoji,
            value: String(index + 1)
          });

          relatedData.push({
            name: related.name ?? "Not found.",
            duration: related.formattedDuration,
            uploader: related.uploader,
            stats: {
              likes: related.likes,
              dislikes: related.dislikes,
              views: related.views
            },
            thumbnail: related.thumbnail,
            platform: getPlatform(related),
            url: related.url
          });
        };

        relatedSongs.addOptions(relateds);

        const row2 = new this.Row({ components: [ relatedSongs ] });

        return await interaction.editReply({ embeds: [ embed ], components: [ row, row2 ] }).then(async (m) => {
          const collector = await m.createMessageComponentCollector();
          collector.on("collect", async (i) => {
            if (i.customId !== "relatedSongs") return;

            const value = Number(i.values[ 0 ]) - 1;

            const relatedSong = relatedData[ value ];

            const embed = new this.Embed({
              title: `Top #${value + 1}`,
              description: `
              \`Name:\` **${relatedSong.name}**
              \`Duration:\` **${relatedSong.duration}**

              \`Views:\` **${relatedSong.stats.views}** 
              \`Likes:\` **${relatedSong.stats.likes}**
              \`Dislikes:\` **${relatedSong.stats.dislikes}**`,
              thumbnail: { url: relatedSong.platform },
              image: { url: relatedSong.thumbnail },
              footer: { text: `Uploaded by '${relatedSong.uploader.name}' ${song.uploader.name === relatedSong.uploader.name ? "(By this song producer)" : ""}` }
            }).setTimestamp().setColor("Random");

            const go = new this.Row({
              components: [
                new this.Button({
                  style: this.ButtonStyle.Link,
                  label: "URL",
                  url: relatedSong?.url ?? "https://discord.com",
                  disabled: relatedSong?.url ? false : true
                })
              ]
            });

            if (!i.replied) await i.reply({ embeds: [ embed ], components: [ go ], ephemeral: true });
            else await i.editReply({ embeds: [ embed ], components: [ go ], ephemeral: true });
          });
        });
      });

      await player.play(voiceChannel, query, { textChannel: channel, member });
    } else if (c === "stop") {
      await interaction.deferReply();

      await player.stop(guild.id).then(async () => await interaction.editReply({ content: `${this.config.Emoji.State.SUCCESS} Music stopped.` }));
    };
  };
};