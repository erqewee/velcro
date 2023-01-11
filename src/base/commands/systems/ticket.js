import { Command } from "../../structures/export.js";

import { v4 as generateID } from "uuid";

import { setTimeout as sleep } from "node:timers/promises";

const topics = [
  {
    name: "Çekiliş",
    value: "giveaway"
  },
  {
    name: "Genel",
    value: "general"
  },
  {
    name: "Şikayet",
    value: "complaint"
  }
];

export default class extends Command {
  constructor() {
    super({ enabled: true, mode: "Global" });

    this.setCommand(new this.SlashCommand()
      .setName("ticket")
      .setDescription("Manage ticket system.")

      .addSubcommand((c) =>
        c.setName("setup").setDescription("Setup ticket system.")
          .addRoleOption((o) => o.setName("support-role").setDescription("Support role.").setRequired(true))
          .addBooleanOption((o) => o.setName("force").setDescription("Enable force setup.")))
      .addSubcommand((c) =>
        c.setName("create").setDescription("Creates new ticket.")
          .addStringOption((o) => o.setName("topic").setDescription("Ticket topic.").addChoices(...topics).setRequired(true)))
      .addSubcommand((c) =>
        c.setName("delete").setDescription("Deletes ticket.")
          .addStringOption((o) => o.setName("ticket-id").setDescription("Ticket ID.").setRequired(true)))
    );
  };

  async execute({ interaction, member: m, channel, guild: g, options, command: c }) {
    const db = this.databases.general;

    if (c === "setup") {
      if (!m.permissions.has(this.Permissions.ManageGuild)) return interaction.reply({ content: `${this.config.Emoji.State.ERROR} Invalid Permission. Required \`Manage Guild\` permission.` });

      const force = options.getBoolean("force");
      const supportRole = options.getRole("support-role");

      if (!force) {
        await interaction.reply({ content: `${this.config.Emoji.State.LOADING} Ticket system creating, Please wait a few seconds.` });

        if (db.fetch(`Guild_${g.id}.Ticket`)) return interaction.editReply({ content: `${this.config.Emoji.State.ERROR} Ticket system already ready. \`(Use force mode to disable this message)\`` })

        return g.channels.create({
          name: "🎫 | Support System",
          type: this.ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: g.id,
              deny: [this.Permissions.ViewChannel]
            }
          ]
        }).then((category) => {
          g.channels.create({ name: "『📦』log", type: this.ChannelType.GuildText, parent: category.id }).then((channel) => {
            db.set(`Guild_${g.id}.Ticket`, {
              Category: category.id,
              Log: channel.id,
              Support: supportRole.id
            });
          });

          return interaction.editReply({ content: `${this.config.Emoji.State.SUCCESS} Ticket system ready.` });
        });
      } else {
        await interaction.reply({ content: `${this.config.Emoji.State.LOADING} Ticket system creating, Please wait a few seconds. \`(Force Mode)\`` });

        const oldCategory = this.client.channels.resolve(db.fetch(`Guild_${g.id}.Ticket.Category`));
        oldCategory ? await oldCategory.delete() : null;

        const oldLog = this.client.channels.resolve(db.fetch(`Guild_${g.id}.Ticket.Log`));
        oldLog ? await oldLog.delete() : null;

        return g.channels.create({
          name: "🎫 | Support System",
          type: this.ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: g.id,
              deny: [this.Permissions.ViewChannel]
            }
          ]
        }).then((category) => {
          g.channels.create({ name: "『📦』log", type: this.ChannelType.GuildText, parent: category.id }).then((channel) => {
            db.set(`Guild_${g.id}.Ticket`, {
              Category: category.id,
              Log: channel.id,
              Support: supportRole.id
            });
          });

          return interaction.editReply({ content: `${this.config.Emoji.State.SUCCESS} Ticket system ready.` });
        });
      };
    } else if (c === "create") {
      const topic = options.getString("topic");

      const log = g.channels.resolve(db.fetch(`Guild_${g.id}.Ticket.Log`));
      const category = g.channels.resolve(db.fetch(`Guild_${g.id}.Ticket.Category`));

      const supportRole = g.roles.resolve(db.fetch(`Guild_${g.id}.Ticket.Support`));

      await interaction.reply({ content: `${this.config.Emoji.State.LOADING} Your ticket is creating. Please wait a few seconds.`, ephemeral: true });

      const ticketID = generateID();

      if (topic === "giveaway") {
        return g.channels.create({
          name: `giveaway-${m.id}`,
          topic: `${m}'s **Giveaway** ticket.`,
          type: this.ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: [
            {
              id: g.id,
              deny: [this.Permissions.ViewChannel]
            },
            {
              id: m.id,
              allow: [this.Permissions.ViewChannel]
            }
          ]
        }).then(async (channel) => {
          const ticketEmbed = new this.Embed({
            title: `${this.client.user.username} - Destek Sistemi | Çekiliş 🎉`,
            description: `Lütfen bu desteği detaylandırın. Böylece bir destek ekibimizde çalışan arkadaşımız bununla ilgilenecek.`,
            thumbnail: { url: m?.displayAvatarURL() },
            footer: { text: `${g.name}`, iconURL: g?.iconURL() },
            fields: [
              {
                name: `${this.config.Emoji.Other.PROTOTIP} Ticket ID`,
                value: `- \`${ticketID}\``
              }
            ]
          });

          const logEmbed = new this.Embed({
            title: `${this.client.user.username} - Destek Sistemi | Destek Açıldı`,
            description: `${this.config.Emoji.State.INFORMATION} Sunucuda yeni bir destek açıldı.`,
            thumbnail: { url: m?.displayAvatarURL() },
            footer: { text: `${g.name}`, iconURL: g?.iconURL() },
            fields: [
              {
                name: `${this.config.Emoji.Other.USER} Kullanıcı`,
                value: `- ${m}`,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.CHAT} Tür`,
                value: `- \`Çekiliş\``,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
                value: `- ${this.time(Date.now())}`,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.Channels.TEXT} Kanal`,
                value: `- ${channel}`
              },
              {
                name: `${this.config.Emoji.Other.PROTOTIP} Ticket ID`,
                value: `- \`${ticketID}\``
              }
            ]
          });

          db.set(`Guild_${g.id}.Tickets.ID_${ticketID}`, {
            Channel: channel.id,
            Log: log.id,
            Member: m.id,
          });

          await channel.send({ content: `${this.config.Emoji.Other.NOTEPAD} ${m} | ${supportRole}`, embeds: [ticketEmbed] });
          await log.send({ embeds: [logEmbed] });

          const row = new this.Row({
            components: [
              new this.Button({
                label: "Go to Support",
                style: this.ButtonStyle.Link,
                url: channel.url
              })
            ]
          });

          return interaction.editReply({ content: `${this.config.Emoji.State.SUCCESS} Your ticket is created.`, components: [row], ephemeral: true });
        });
      } else if (topic === "general") {
        return g.channels.create({
          name: `general-${m.id}`,
          topic: `${m}'s **General** ticket.`,
          type: this.ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: [
            {
              id: g.id,
              deny: [this.Permissions.ViewChannel]
            },
            {
              id: m.id,
              allow: [this.Permissions.ViewChannel]
            }
          ]
        }).then(async (channel) => {
          const ticketEmbed = new this.Embed({
            title: `${this.client.user.username} - Destek Sistemi | Genel 🌐`,
            description: `Lütfen bu desteği detaylandırın. Böylece bir destek ekibimizde çalışan arkadaşımız bununla ilgilenecek.`,
            thumbnail: { url: m?.displayAvatarURL() },
            footer: { text: `${g.name}`, iconURL: g?.iconURL() },
            fields: [
              {
                name: `${this.config.Emoji.Other.PROTOTIP} Ticket ID`,
                value: `- \`${ticketID}\``
              }
            ]
          });

          const logEmbed = new this.Embed({
            title: `${this.client.user.username} - Destek Sistemi | Destek Açıldı`,
            description: `${this.config.Emoji.State.INFORMATION} Sunucuda yeni bir destek açıldı.`,
            thumbnail: { url: m?.displayAvatarURL() },
            footer: { text: `${g.name}`, iconURL: g?.iconURL() },
            fields: [
              {
                name: `${this.config.Emoji.Other.USER} Kullanıcı`,
                value: `- ${m}`,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.CHAT} Tür`,
                value: `- \`Genel\``,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
                value: `- ${this.time(Date.now())}`,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.Channels.TEXT} Kanal`,
                value: `- ${channel}`
              },
              {
                name: `${this.config.Emoji.Other.PROTOTIP} Ticket ID`,
                value: `- \`${ticketID}\``
              }
            ]
          });

          db.set(`Guild_${g.id}.Tickets.ID_${ticketID}`, {
            Channel: channel.id,
            Log: log.id,
            Member: m.id,
          });

          await channel.send({ content: `${this.config.Emoji.Other.NOTEPAD} ${m} | ${supportRole}`, embeds: [ticketEmbed] });
          await log.send({ embeds: [logEmbed] });

          const row = new this.Row({
            components: [
              new this.Button({
                label: "Go to Support",
                style: this.ButtonStyle.Link,
                url: channel.url
              })
            ]
          });

          return interaction.editReply({ content: `${this.config.Emoji.State.SUCCESS} Your ticket is created.`, components: [row], ephemeral: true });
        });
      } else if (topic === "complaint") {
        return g.channels.create({
          name: `complaint-${m.id}`,
          topic: `${m}'s **Complaint** ticket.`,
          type: this.ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: [
            {
              id: g.id,
              deny: [this.Permissions.ViewChannel]
            },
            {
              id: m.id,
              allow: [this.Permissions.ViewChannel]
            }
          ]
        }).then(async (channel) => {
          const ticketEmbed = new this.Embed({
            title: `${this.client.user.username} - Destek Sistemi | Şikayet 📛`,
            description: `Lütfen bu desteği detaylandırın. Böylece bir destek ekibimizde çalışan arkadaşımız bununla ilgilenecek.`,
            thumbnail: { url: m?.displayAvatarURL() },
            footer: { text: `${g.name}`, iconURL: g?.iconURL() },
            fields: [
              {
                name: `${this.config.Emoji.Other.PROTOTIP} Ticket ID`,
                value: `- \`${ticketID}\``
              }
            ]
          });

          const logEmbed = new this.Embed({
            title: `${this.client.user.username} - Destek Sistemi | Destek Açıldı`,
            description: `${this.config.Emoji.State.INFORMATION} Sunucuda yeni bir destek açıldı.`,
            thumbnail: { url: m?.displayAvatarURL() },
            footer: { text: `${g.name}`, iconURL: g?.iconURL() },
            fields: [
              {
                name: `${this.config.Emoji.Other.USER} Kullanıcı`,
                value: `- ${m}`,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.CHAT} Tür`,
                value: `- \`Şikayet\``,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
                value: `- ${this.time(Date.now())}`,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.Channels.TEXT} Kanal`,
                value: `- ${channel}`
              },
              {
                name: `${this.config.Emoji.Other.PROTOTIP} Ticket ID`,
                value: `- \`${ticketID}\``
              }
            ]
          });

          db.set(`Guild_${g.id}.Tickets.ID_${ticketID}`, {
            Channel: channel.id,
            Log: log.id,
            Member: m.id,
          });

          await channel.send({ content: `${this.config.Emoji.Other.NOTEPAD} ${m} | ${supportRole}`, embeds: [ticketEmbed] });
          await log.send({ embeds: [logEmbed] });

          const row = new this.Row({
            components: [
              new this.Button({
                label: "Go to Support",
                style: this.ButtonStyle.Link,
                url: channel.url
              })
            ]
          });

          return interaction.editReply({ content: `${this.config.Emoji.State.SUCCESS} Your ticket is created.`, components: [row], ephemeral: true });
        });
      };
    } else if (c === "delete") {
      const id = options.getString("ticket-id");

      await interaction.reply({ content: `${this.config.Emoji.State.LOADING} Ticket searching. (ID: ${id})` });

      if (!db.fetch(`Guild_${g.id}.Tickets.ID_${id}`)) return interaction.editReply({ content: `${this.config.Emoji.State.ERROR} Ticket not found. Check ID. (ID: ${id})` });

      const channel = g.channels.resolve(db.fetch(`Guild_${g.id}.Tickets.ID_${id}.Channel`));
      const member = g.members.resolve(db.fetch(`Guild_${g.id}.Tickets.ID_${id}.Member`));

      const log = g.channels.resolve(db.fetch(`Guild_${g.id}.Ticket.Log`));
      const supportRole = g.roles.resolve(db.fetch(`Guild_${g.id}.Ticket.Support`));

      if (member.id !== m.id && !m.roles.cache.has(supportRole.id)) return interaction.editReply({ content: `${this.config.Emoji.State.ERROR} This support is not yours. Check ID. (ID: ${id})` });
      if (!channel) {
        db.del(`Guild_${g.id}.Tickets.ID_${id}`);

        const logEmbed = new this.Embed({
          title: `${this.client.user.username} - Destek Sistemi | Destek Kapatıldı`,
          description: `${this.config.Emoji.State.INFORMATION} Sunucuda bir destek kapatıldı.`,
          thumbnail: { url: member?.displayAvatarURL() },
          footer: { text: `${g.name}`, iconURL: g?.iconURL() },
          fields: [
            {
              name: `${this.config.Emoji.Other.USER} Kullanıcı`,
              value: `- ${member}`,
              inline: true
            },
            {
              name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
              value: `- ${this.time(Date.now())}`,
              inline: true
            },
            {
              name: `${this.config.Emoji.Other.PROTOTIP} Ticket ID`,
              value: `- \`${id}\``
            }
          ]
        });

        await log.send({ embeds: [logEmbed] });
        
        return interaction.editReply({ content: `${this.config.Emoji.State.WARNING} Support channel is not found. Ticket informations has been deleted from the database. (ID: ${id})` });
      };

      await interaction.editReply({ content: `${this.config.Emoji.State.SUCCESS} Ticket found and deleted. (ID: ${id})` });

      await sleep(5);

      return channel.delete().then(async () => {
        const logEmbed = new this.Embed({
          title: `${this.client.user.username} - Destek Sistemi | Destek Kapatıldı`,
          description: `${this.config.Emoji.State.INFORMATION} Sunucuda bir destek kapatıldı.`,
          thumbnail: { url: member?.displayAvatarURL() },
          footer: { text: `${g.name}`, iconURL: g?.iconURL() },
          fields: [
            {
              name: `${this.config.Emoji.Other.USER} Kullanıcı`,
              value: `- ${member}`,
              inline: true
            },
            {
              name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
              value: `- ${this.time(Date.now())}`,
              inline: true
            },
            {
              name: `${this.config.Emoji.Other.PROTOTIP} Ticket ID`,
              value: `- \`${id}\``
            }
          ]
        });

        await log.send({ embeds: [logEmbed] });

        return db.del(`Guild_${g.id}.Tickets.ID_${id}`);
      });
    };
  };
};