import { Command } from "../../structures/export.js";

import { CacheManager } from "../../CacheManager.js";

export default class extends Command {
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

    this.execute = async function ({ interaction, member: m, channel, guild, options }) {
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

        if (db.fetch(`BlackList.Member_${member.id}`)) return interaction.reply({
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

        db.set(`BlackList.Member_${member.id}`, { State: true, Date: date, Reason: reason, Employee: m.id });
        db.push("BlackList.Members", member.id);

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

        if (!db.fetch(`BlackList.Member_${member.id}`)) return interaction.reply({
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

        db.del(`BlackList.Member_${member.id}`);
        db.pull("BlackList.Members", (data) => data === member.id);

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

        if (!db.fetch(`BlackList.Member_${member.id}`)) return interaction.reply({
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

        const reason = String(db.fetch(`BlackList.Member_${member.id}.Reason`) ?? "Sebep Belirtilmedi");
        const employee = await (await this.client.guilds.resolve("942839259876958268")).members.resolve(String(db.fetch(`BlackList.Member_${member.id}.Employee`)));

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
        const data = new CacheManager();
        const embeds = [];

        await interaction.reply({ embeds: [new this.Embed({ description: `${this.config.Emoji.State.LOADING} Veriler yükleniyor...` })] });

        const blacklist = db.fetch(`BlackList.Members`);
        if (!blacklist || blacklist.length < 1) return interaction.editReply(`${this.config.Emoji.State.ERROR} Veri girdisi bulunamadı.`);

        await Promise.all(blacklist.map(async (USER_ID, INDEX) => {
          const user = await this.client.users.fetch(USER_ID);

          const reason = String(db.fetch(`BlackList.Member_${user.id}.Reason`) ?? "Sebep Belirtilmedi.");
          const date = Number(db.fetch(`BlackList.Member_${user.id}.Date`));
          const employee = this.client.guilds.resolve("942839259876958268").members.resolve(String(db.fetch(`BlackList.Member_${user.id}.Employee`)));

          await interaction.editReply({
            embeds: [
              new this.Embed({
                title: `${this.client.user.username} - Kara Liste | Sıralama Yükleniyor`,
                description: `${this.config.Emoji.State.LOADING} Kullanıcılar alınıyor. Bu işlem uzun sürebilir.`,
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

          return data.set(user.id, {
            index: INDEX + 1,
            embed: new this.Embed({
              title: `${this.client.user.username} - Kara Liste | Sıralama #${INDEX + 1}`,
              description: `
                ${this.config.Emoji.Other.USER} ${user.tag} | ${user.id}
  
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

        await Promise.all(data.map((a) => a).sort((a, b) => a.index - b.index).map((dat) => embeds.push(dat.embed)));

        return await this.pagination(interaction, { embeds }).catch((err) => console.log(err));
      };
    };
  };
};