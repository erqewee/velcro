import { SlashCommand } from "../../../structures/export.js";

export default class extends SlashCommand {
  constructor() {
    super({ enabled: true, mode: "Global" });

    this.setCommand(new this.SlashCommand()
      .setName("info")
      .setDescription("Get informations some for selected subcommands.")
      .addSubcommand((c) => c.setName("role").setDescription("Get information for provided role.").addRoleOption((o) => o.setName("mention").setDescription("Provide role.").setRequired(true)).addBooleanOption((o) => o.setName("ephemeral").setDescription("Ephemeral response.")))
      .addSubcommand((c) => c.setName("channel").setDescription("Get information for provided channel.").addChannelOption((o) => o.setName("mention").setDescription("Provide channel.").setRequired(true)).addBooleanOption((o) => o.setName("ephemeral").setDescription("Ephemeral response.")))
      .addSubcommand((c) => c.setName("member").setDescription("Get information for provided member.").addUserOption((o) => o.setName("user").setDescription("Provide user.").setRequired(true)).addBooleanOption((o) => o.setName("ephemeral").setDescription("Ephemeral response.")))
      .addSubcommand((c) => c.setName("emoji").setDescription("Get information for provided emoji.").addStringOption((o) => o.setName("name").setDescription("Provide emoji name.").setRequired(true)))
    );
  };

  async execute({ interaction, member, channel, guild, options }) {
    const Type = this.ChannelType;
    const Emoji = this.config.Emoji;

    const client = this.client;

    const ephemeral = options.getBoolean("ephemeral");

    if (options.getSubcommand(false) === "role") {
      const role = await this.roles.get(guild.id, options.getRole("mention").id);

      const embed = new this.Embed({
        title: `${client.user.username} - Information | Role`,
        description: `
                       ${Emoji.Other.INFINITE} \`Name:\` ${role.name} \`(${role.name})\`
                       ${Emoji.Other.FIRE} \`ID:\` ${role.id}
                       ${Emoji.Other.CRYSTAL} \`Color:\` ${role.hexColor}
                       ${Emoji.Other.MENTION} \`Mentionable:\` ${role.mentionable ? `Yes \`(<@&${role.id}>)\`` : "No"}

                       ${Emoji.Other.TIME} \`Created At:\` ${role?.createdAt ? `<t:${Math.floor(role.createdAt / 1000)}:R>` : `No data found.`}
                       `
      }).setColor("Random");

      return interaction.reply({ embeds: [embed], ephemeral });
    } else if (options.getSubcommand(false) === "channel") {
      const channel = this.channels.cache.get(options.getChannel("mention").id);

      const ctype = channel.type;
      let type = "";

      if (ctype === Type.AnnouncementThread) type = "Announcement Thread";
      else if (ctype === Type.DM) type = Emoji.Other.Channels.DM;
      else if (ctype === Type.GroupDM) type = "Group DM";
      else if (ctype === Type.GuildAnnouncement) type = Emoji.Other.Channels.ANNOUNCE;
      else if (ctype === Type.GuildCategory) type = Emoji.Other.Channels.CREATECATEGORY;
      else if (ctype === Type.GuildDirectory) type = "Directory";
      else if (ctype === Type.GuildForum) type = Emoji.Other.Channels.FORUM;
      else if (ctype === Type.GuildStageVoice) type = Emoji.Other.Channels.STAGE;
      else if (ctype === Type.GuildText) type = Emoji.Other.Channels.TEXT;
      else if (ctype === Type.GuildVoice) type = Emoji.Other.Channels.VOICE;
      else if (ctype === Type.PrivateThread) type = Emoji.Other.Channels.THREAD + " (Private)";
      else if (ctype === Type.PublicThread) type = Emoji.Other.Channels.THREAD + " (Public)";

      const embed = new this.Embed({
        title: `${client.user.username} - Information | Channel`,
        description: `
                       ${Emoji.Other.INFINITE} \`Name:\` ${channel.name} \`(${channel.name})\`
                       ${Emoji.Other.FIRE} \`ID:\` ${channel.id}
                       ${Emoji.Other.Channels.NSFW} \`NSFW:\` ${channel.nsfw ? "Yes" : "No"}
                       ${Emoji.Other.PIN} \`Viewable:\` ${channel.viewable ? "Yes" : "No"}
                       ${Emoji.Other.Channels.CREATE} \`Type:\` ${type}
                       ${Emoji.Other.EDITOR} \`Raw Position:\` ${channel.rawPosition}
                       ${Emoji.Other.MENTION} \`Mention:\` \`<#${channel.id}>\`

                       ${Emoji.Other.TIME} \`Created At:\` ${channel?.createdAt ? `<t:${Math.floor(channel.createdAt / 1000)}:R>` : `No data found.`}
                       `
      }).setColor("Random");

      const url = new this.Button({
        style: this.ButtonStyle.Link,
        label: "URL",
        url: channel.url,
        emoji: { name: "link", id: "831599926818504735", animated: true }
      });

      const row = new this.Row({
        components: [url]
      });

      return interaction.reply({ embeds: [embed], components: [row], ephemeral });
    } else if (options.getSubcommand(false) === "member") {
      const u = await this.users.get(options.getUser("user").id);
      const m = await this.members.get(guild.id, u.id);

      const embed = new this.Embed({
        title: `${client.user.username} - Information | Member`,
        description: `
                      ${Emoji.Other.INFINITE} \`Name:\` ${m.user.username} \`(${m.user.tag})\`
                      ${Emoji.Other.FIRE} \`ID:\` ${m.id}
                      ${Emoji.Other.CARE} \`Kickable:\` ${m.kickable ? "Yes" : "No"} 
                      ${Emoji.Other.CARE} \`Bannable:\` ${m.bannable ? "Yes" : "No"}
                      ${Emoji.Other.CARE} \`Manageable:\` ${m.manageable ? "Yes" : "No"} 
                      ${Emoji.Other.CARE} \`Moderatable:\` ${m.moderatable ? "Yes" : "No"}
                      
                      
                      ${Emoji.Other.TIME} \`Joined At:\` ${m?.joinedAt ? `<t:${Math.floor(m.joinedAt / 1000)}:R>` : "No data found."}
                      ${Emoji.Other.TIME} \`Created At:\` ${u?.createdAt ? `<t:${Math.floor(u.createdAt / 1000)}:R>` : "No data found."}
                       `
      }).setColor("Random");

      const avatarURL = new this.Button({
        style: this.ButtonStyle.Link,
        label: "Avatar URL",
        disabled: m.user?.displayAvatarURL() ? false : true,
        url: m.user.displayAvatarURL()
      });

      const row = new this.Row({
        components: [avatarURL]
      });

      return interaction.reply({ embeds: [embed], components: [row], ephemeral });
    } else if (options.getSubcommand(false) === "emoji") {
      await interaction.reply({ content: `${Emoji.State.LOADING} Searching...` });

      const embeds = [];
      const components = [];

      return this.emojis.getByName(options.getString("name"), async (data) => {
        await Promise.all(data.map(async (EMOJI_DATA) => {
          const guild = this.guilds.cache.get(EMOJI_DATA.guild.id);
          const emoji = await this.emojis.get(guild.id, EMOJI_DATA.id);

          const gn = guild.name;
          let n = gn

          this.changeCharacter({
            string: gn,
            callback: (character, storage) => storage.map((w) => n = n.replace(w, character))
          });

          const invites = await this.invites.map(guild.id);

          embeds.push(new this.Embed({
            title: `${client.user.username} - Information | Emoji`,
            description: `
                                 ${Emoji.Other.INFINITE} \`Name:\` ${emoji.name} \`(${emoji.name})\`
                                 ${Emoji.Other.FIRE} \`ID:\` ${emoji.id}
                                 ${Emoji.Other.PIN} \`Animated:\` ${emoji.animated ? "Yes" : "No"}
                                 ${Emoji.Other.CRYSTAL} \`Available:\` ${emoji.available ? "Yes" : "No"}
                                 ${Emoji.Other.TRASH} \`Deletable:\` ${emoji.deletable ? "Yes" : "No"}
                                 ${Emoji.Other.CARE} \`Managed:\` ${emoji.managed ? "Yes" : "No"}
                                 ${Emoji.Other.MENTION} \`Mention:\` \`<${emoji.animated ? `a:${emoji.name}:${emoji.id}` : `:${emoji.name}:${emoji.id}`}>\`
                                 
                                 
                                 ${Emoji.Other.GUILD} \`Guild:\` ${n}
                                 ${Emoji.Other.TIME} \`Created At:\` ${EMOJI_DATA?.createdAt ? `<t:${Math.floor(EMOJI_DATA.createdAt / 1000)}:R>` : "No data found."}
                                 ${Emoji.Other.ADMIN} \`Created By:\` ${emoji?.user ? `<@${(await this.users.get(emoji.user.id)).id}>` : "No data found."}
                                 `,
            thumbnail: {
              url: EMOJI_DATA.url
            }
          }).setColor("Random"));

          const emojiURL = new this.Button({
            style: this.ButtonStyle.Link,
            label: "Emoji URL",
            url: EMOJI_DATA.url
          });

          const supportServer = new this.Button({
            style: this.ButtonStyle.Link,
            label: "Join Emoji Server",
            url: invites.length > 0 ? `https://discord.gg/${invites[0].code}` : "https://discord.com/",
            disabled: invites.length > 0 ? false : true
          });

          components.push(new this.Row({ components: [emojiURL, supportServer] }));
        }));

        if (data.length < 1) return interaction.editReply({ content: `${Emoji.State.ERROR} **${data.length}** emojis found.` });

        await interaction.editReply({ content: `${Emoji.State.SUCCESS} **${data.length}** emojis found.` });
        return interaction.followUp({ embeds, components, ephemeral: true });
      });
    };
  };
};