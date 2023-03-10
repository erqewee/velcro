import { SlashCommand } from "../../../structures/export.js";

import { CacheManager } from "../../../CacheManager.js";

export default class extends SlashCommand {
  constructor() {
    super({ enabled: true, mode: "Global" });

    this.setCommand(new this.SlashCommand()
      .setName("blacklist")
      .setDescription("Manage member black list.")
      .addSubcommand((c) =>
        c.setName("add")
          .setDescription("Add blacklist to provided member.")
          .addUserOption((o) => o.setName("mention").setDescription("Provide member.").setRequired(true))
          .addStringOption((o) => o.setName("reason").setDescription("Provide blacklist reason.").setMinLength(8).setMaxLength(64))
      )
      .addSubcommand((c) =>
        c.setName("delete")
          .setDescription("Remove blacklist from provided member.")
          .addUserOption((o) => o.setName("mention").setDescription("Provide member.").setRequired(true))
      )
      .addSubcommand((c) =>
        c.setName("state")
          .setDescription("Check blacklist state for provided member.")
          .addUserOption((o) => o.setName("mention").setDescription("Provide member.").setRequired(true))
      )
      .addSubcommand((c) =>
        c.setName("list")
          .setDescription("BlackList List")
      )
    );
  };

  async execute({ interaction, member: m, channel, guild, options }) {
    const db = this.databases.subscribe;

    const date = Math.floor(Date.now() / 1000);
    const formattedDate = `<t:${date}:R>`;

    const command = options.getSubcommand(false);

    const config = {
      employee: db.fetch(`Subscribe.Settings.EmployeeRole`)
    };

    if (!m.roles.cache.has(config.employee) && !m.permissions.has(this.Permissions.ManageGuild)) return interaction.reply({
      embeds: [
        new this.Embed({
          title: `${this.client.user.username} - Kara Liste | Geçersiz Yetki & İzin`,
          description: `${this.config.Emoji.State.ERROR} Bu komutu kullanmak için yetkiniz yetmiyor.`,
          thumbnail: {
            url: guild?.iconURL()
          },
          fields: [
            {
              name: `${this.config.Emoji.Other.ADMIN} Gerekli Rol`,
              value: `- \`${(await this.roles.get(guild.id, config.employee)).name}\``,
              inline: true
            },
            {
              name: `${this.config.Emoji.Other.PERMISSION} Gerekli İzin`,
              value: `- \`Manage Guild\``,
              inline: true
            }
          ]
        })
      ]
    });

    if (command === "add") {
      const member = options.getUser("mention");

      const reason = options.getString("reason") ?? null;

      const blacklistData = db.fetch("Subscribe.BlackList")?.filter((value) => value.id === member.id)[0];

      if (blacklistData?.reason) return interaction.reply({
        embeds: [
          new this.Embed({
            title: `${this.client.user.username} - Kara Liste | Kara Liste Kullanıcısı`,
            description: `${this.config.Emoji.State.WARNING} ${member} Zaten kara listede bulunuyor.`,
            fields: [
              {
                name: `${this.config.Emoji.Other.EDITOR} Kaldır`,
                value: `- \`/blacklist delete mention:${member.id}\``,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.EDITOR} Kontrol Et`,
                value: `- \`/blacklist state mention:${member.id}\``,
                inline: true
              }
            ],
            thumbnail: {
              url: guild.iconURL()
            }
          })
        ]
      });

      db.push("Subscribe.BlackList", {
        date: this.time(Date.now(), { onlyNumberOutput: true }),
        reason: reason,
        employee: m.id
      });

      return interaction.reply({
        embeds: [
          new this.Embed({
            title: `${this.client.user.username} - Kara Liste | Eklendi`,
            description: `${this.config.Emoji.State.SUCCESS} ${member} kullanıcısı karalisteye eklendi.`,
            thumbnail: {
              url: guild?.iconURL()
            },
            fields: [
              {
                name: `${this.config.Emoji.Other.EDITOR} Kaldır`,
                value: `- \`/blacklist delete mention:${member.id}\``
              }
            ]
          })
        ]
      });
    } else if (command === "delete") {
      const member = options.getUser("mention");

      const blacklistData = db.fetch("Subscribe.BlackList")?.filter((value) => value.id === member.id)[0];

      if (!blacklistData?.reason) return interaction.reply({
        embeds: [
          new this.Embed({
            title: `${this.client.user.username} - Kara Liste | Kara Liste Kullanıcısı Değil`,
            description: `${this.config.Emoji.State.WARNING} ${member} Zaten kara listede bulunmuyor`,
            fields: [
              {
                name: `${this.config.Emoji.Other.EDITOR} Ekle`,
                value: `- \`/blacklist add mention:${member.id} reason:Banned\``,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.EDITOR} Abone Rolü`,
                value: `- \`/subscribe add mention:${member.id}\``,
                inline: true
              }
            ],
            thumbnail: {
              url: guild.iconURL()
            }
          })
        ]
      });

      db.pull("Subscribe.BlackList", (data) => data.id === member.id);

      return interaction.reply({
        embeds: [
          new this.Embed({
            title: `${this.client.user.username} - Kara Liste | Kaldırıldı`,
            description: `${this.config.Emoji.State.SUCCESS} ${member} kullanıcısı karalisteden kaldırıldı.`,
            thumbnail: {
              url: guild?.iconURL()
            },
            fields: [
              {
                name: `${this.config.Emoji.Other.EDITOR} Ekle`,
                value: `- \`/blacklist add mention:${member.id}\``
              }
            ]
          })
        ]
      });
    } else if (command === "state") {
      const member = options.getUser("mention");

      const blacklistData = db.fetch("Subscribe.BlackList")?.filter((value) => value.id === member.id)[0];

      if (!blacklistData?.reason) return interaction.reply({
        embeds: [
          new this.Embed({
            title: `${this.client.user.username} - Kara Liste | Kara Liste Kullanıcısı Değil`,
            description: `${this.config.Emoji.State.WARNING} ${member} Zaten kara listede bulunmuyor`,
            fields: [
              {
                name: `${this.config.Emoji.Other.EDITOR} Ekle`,
                value: `- \`/blacklist add mention:${member.id} reason:Ready\``,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.EDITOR} Abone Rolü Ekle`,
                value: `- \`/subscribe add mention:${member.id}\``,
                inline: true
              }
            ],
            thumbnail: {
              url: guild.iconURL()
            }
          })
        ]
      });

      const reason = String(blacklistData?.reason ?? "Sebep Belirtilmedi");
      const employee = this.client.guilds.resolve("942839259876958268").members.resolve(String(blacklistData?.employee ?? m.id));

      return interaction.reply({
        embeds: [
          new this.Embed({
            title: `${this.client.user.username} - Kara Liste | Kullanıcı Bilgisi`,
            description: `${this.config.Emoji.State.SUCCESS} ${member} kullanıcısının karaliste bilgilerini görüntülüyorsunuz.`,
            thumbnail: {
              url: member?.displayAvatarURL ? member?.displayAvatarURL() : guild?.iconURL()
            },
            fields: [
              {
                name: `${this.config.Emoji.Other.ADMIN} Yetkili`,
                value: `- ${employee}`,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
                value: `- ${formattedDate}`,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.NOTEPAD} Sebep`,
                value: `- \`${reason}\``
              }
            ]
          })
        ]
      });
    } else if (command === "list") {
      const storage = new CacheManager();
      const embeds = [];

      await interaction.reply({ embeds: [new this.Embed({ description: `${this.config.Emoji.State.LOADING} Veriler yükleniyor...` })] });

      const blacklist = db.fetch("Subscribe.BlackList");
      if (!blacklist || blacklist.length < 1) return interaction.editReply(`${this.config.Emoji.State.ERROR} Veri girdisi bulunamadı.`);

      await Promise.all(blacklist.map(async (data, INDEX) => {
        const user = await this.client.users.fetch(data.id);

        const blacklistData = blacklist.filter((value) => value.id === user.id)[0];

        const reason = String(blacklistData?.reason ?? "Sebep Belirtilmedi.");
        const date = Number(blacklistData?.date);
        const employee = this.client.guilds.resolve("942839259876958268").members.resolve(String(blacklistData?.employee ?? m.id));

        await interaction.editReply({
          embeds: [
            new this.Embed({
              title: `${this.client.user.username} - Kara Liste | Sıralama Yükleniyor`,
              description: `${this.config.Emoji.State.LOADING} Veri girdileri alınıyor. Bu işlem uzun sürebilir.`,
              fields: [
                {
                  name: `${this.config.Emoji.Other.INFINITE} Tamamlandı`,
                  value: `- \`${INDEX + 1}\``,
                  inline: true,
                },
                {
                  name: `${this.config.Emoji.Other.FIRE} Tamamlanmadı`,
                  value: `- \`${blacklist.length - (INDEX + 1)}\``,
                  inline: true
                }
              ],
              thumbnail: {
                url: user?.avatarURL()
              },
              author: {
                name: `${user.tag} | ${user.id}`,
                iconURL: guild?.iconURL()
              }
            })
          ]
        });

        return storage.set(user.id, {
          index: INDEX + 1,
          embed: new this.Embed({
            title: `${this.client.user.username} - Kara Liste | Sıralama #${INDEX + 1}`,
            description: `
              ${this.config.Emoji.Other.USER} ${user.tag} | ${user.id}
              ${this.client.guilds.resolve("942839259876958268").members.resolve(user.id)?.displayName ? `${this.config.Emoji.Other.FIRE} Sunucuda Var` : `${this.config.Emoji.Other.TRASH} Sunucuda Yok`}

              ${this.config.Emoji.Other.ADMIN} <@${employee.id}>
              ${this.config.Emoji.Other.CALENDAR} <t:${date}:R>
              ${this.config.Emoji.Other.NOTEPAD} \`${reason}\`
              `,
            thumbnail: {
              url: user?.avatarURL()
            }
          })
        });
      }));

      interaction.editReply({
        embeds: [
          new this.Embed({
            title: `${this.client.user.username} - Kara Liste | Sıralama İşleniyor`,
            description: `${this.config.Emoji.State.LOADING} Son kontroller yapılıyor, Bu işlem birkaç dakika sürebilir.`
          })
        ]
      });

      await Promise.all(storage.map((a) => a).sort((a, b) => a.index - b.index).map((dat) => embeds.push(dat.embed)));

      return await this.pagination(interaction, { embeds }).catch((err) => console.log(err));
    };
  };
};