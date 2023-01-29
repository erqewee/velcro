import { Event } from "../../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: true });

    this.setName(this.Events.Discord.MessageCreate);
  };

  async execute(message) {
    const client = message.client;

    if (message.author.bot) return;
    if (message.attachments.size < 1) return;

    const member = message.member;
    const user = await client.users.fetch(member.id);

    const db = this.databases.subscribe;
    const guild = client.guilds.resolve("942839259876958268");

    const config = {
      employee: db.fetch(`Subscribe.Settings.EmployeeRole`),
      log: db.fetch(`Subscribe.Settings.LogChannel`),
      password: db.fetch(`Subscribe.Settings.Password`),
      subscribe: db.fetch(`Subscribe.Settings.SubscribeRole`),
      subscribeChannel: db.fetch(`Subscribe.Settings.SubscribeChannel`),
      lastVideo: db.fetch("Subscribe.Settings.Videos.Last")
    };

    const availableChannels = [config.subscribeChannel, "982987883344429066"];
    const blacklist = db.fetch(`Subscribe.BlackList`)?.filter((value) => value.id === member.id)[0];

    let mention = "";
    const embeds = [];
    const components = [];

    if (!blacklist?.employee) components.push(new this.Row({
      components: [
        new this.Button({
          style: this.ButtonStyle.Link,
          label: "Son Video'ya Git",
          url: String(config.lastVideo).startsWith("https://") ? config.lastVideo : "https://discord.com/",
          disabled: String(config.lastVideo).startsWith("https://") ? false : true
        })
      ]
    }));

    if (availableChannels.includes(message.channel.id)) {
      if (blacklist?.employee) {
        const reason = blacklist?.reason;
        const employee = await guild.members.resolve(blacklist?.employee);
        const date = blacklist?.date;

        embeds.push(new this.Embed({
          title: this.translate("data:events.util.message.blacklist.title", { variables: [{ name: "client.user.username", value: client.user.username }] }),
          description: this.translate("data:events.util.message.blacklist.description", { variables: [{ name: "trashEmote", value: this.config.Emoji.Other.TRASH }] }),
          fields: [
            {
              name: this.translate("data:events.util.message.blacklist.fields.employee", { variables: [{ name: "employeeEmote", value: this.config.Emoji.Other.ADMIN }] }),
              value: `- ${employee}`,
              inline: true
            },
            {
              name: this.translate("data:events.util.message.blacklist.fields.date", { variables: [{ name: "calendarEmote", value: this.config.Emoji.Other.CALENDAR }] }),
              value: `- <t:${date}:R>`,
              inline: true
            },
            {
              name: this.translate("data:events.util.message.blacklist.fields.reason", { variables: [{ name: "notepadEmote", value: this.config.Emoji.Other.NOTEPAD }] }),
              value: `- ${reason}`
            }
          ],
          author: {
            name: `${user.tag} | ${user.id}`,
            iconURL: guild?.iconURL()
          },
          thumbnail: {
            url: user?.avatarURL()
          }
        }));
      } else embeds.push(new this.Embed({
        title: this.translate("data:events.util.message.subscribe.title", { variables: [{ name: "client.user.username", value: client.user.username }] }),
        description: this.translate("data:events.util.message.subscribe.description"),
        fields: [
          {
            name: this.translate("data:events.util.message.subscribe.fields.add", { variables: [{ name: "checkEmote", value: this.config.Emoji.Other.YES }] }),
            value: `\`/subscribe add mention:${member.id}\``
          }
        ],
        author: {
          name: `${user.tag} | ${user.id}`,
          iconURL: guild?.iconURL()
        },
        thumbnail: {
          url: member?.displayAvatarURL()
        }
      }));

      if (message.channel.id === availableChannels[0]) {
        if (this.client.user.id !== "944965150358790185") return;

        mention = blacklist ? `<@${member.id}>` : `<@${member.id}> | <@&${config.employee}>`;

        return client.channels.resolve(availableChannels[0]).send({ content: `${this.config.Emoji.Other.ACTIVITY} ${mention}`, embeds, components });
      };

      if (message.channel.id === availableChannels[1]) {
        mention = `<@${member.id}>`;

        return client.channels.resolve(availableChannels[1]).send({ content: `${this.config.Emoji.Other.ACTIVITY} ${mention}`, embeds, components });
      };
    };
  };
};