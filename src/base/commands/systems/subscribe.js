import { Command } from "../../structures/export.js";

import { CacheManager } from "../../CacheManager.js";

export default class extends Command {
  constructor() {
    super({
      enabled: true,
      support: false
    });

    this.setCommand(new this.SlashCommand()
      .setName("subscribe")
      .setDescription("Manage member subscribe roles.")
      .addSubcommand((c) =>
        c.setName("add")
          .setDescription("Add subscribe role to provided member.")
          .addUserOption((o) => o.setName("mention").setDescription("Provide member.").setRequired(true))
      )
      .addSubcommand((c) =>
        c.setName("delete")
          .setDescription("Remove subscribe role to provided member.")
          .addUserOption((o) => o.setName("mention").setDescription("Provide member.").setRequired(true))
      )
      .addSubcommand((c) =>
        c.setName("state")
          .setDescription("Check subscribe state for provided member.")
          .addUserOption((o) => o.setName("mention").setDescription("Provide member.").setRequired(true))
      )
      .addSubcommand((c) =>
        c.setName("list")
          .setDescription("Subscribe list")
      )
      .addSubcommand((c) =>
        c.setName("set")
          .setDescription("Edit settings for subscribe system.")
          .addChannelOption((o) => o.setName("log-channel").setDescription("Provide log channel").addChannelTypes(0).setRequired(true))
          .addRoleOption((o) => o.setName("employee").setDescription("Provide employee role.").setRequired(true))
          .addRoleOption((o) => o.setName("subscribe-role").setDescription("Provide subscribe role.").setRequired(true))
          .addChannelOption((o) => o.setName("subscribe-channel").setDescription("Provide subscribe channel").addChannelTypes(0).setRequired(true))
          .addStringOption((o) => o.setName("password").setDescription("Provide password for buttons.").setMinLength(16).setRequired(true))
      )
    );

    this.execute = async function ({ interaction, member: m, channel, guild, options }) {
      const db = this.client.database.subscribe;

      const config = {
        employee: db.fetch(`Subscribe.Settings.EmployeeRole`),
        log: db.fetch(`Subscribe.Settings.LogChannel`),
        password: db.fetch(`Subscribe.Settings.Password`),
        subscribe: db.fetch(`Subscribe.Settings.SubscribeRole`),
        subscribeChannel: db.fetch(`Subscribe.Settings.SubscribeChannel`)
      };

      if (options.getSubcommand(false) === "set") {
        if (!m.permissions.has("ManageGuild")) return interaction.reply({
          embeds: [
            new this.Embed({
              title: `${this.client.user.username} - Abone Sistemi | Yetersiz Yetki & İzin`,
              description: `${this.config.Emoji.State.ERROR} Abone sistemini \`Sunucuyu Yönet\` yetkisi olan birisinden ayarlamasını isteyiniz.`
            })
          ],

          ephemeral: true
        });

        const role = options.getRole("employee").id;
        const log = options.getChannel("log-channel").id;
        const pw = options.getString("password");
        const subRole = options.getRole("subscribe-role").id;
        const subChannel = options.getChannel("subscribe-channel").id;

        db.set("Subscribe.Settings.Password", pw);
        db.set("Subscribe.Settings.EmployeeRole", role);
        db.set("Subscribe.Settings.LogChannel", log);
        db.set("Subscribe.Settings.SubscribeChannel", subChannel);
        db.set("Subscribe.Settings.SubscribeRole", subRole);

        return interaction.reply({ content: `${this.config.Emoji.State.SUCCESS} Başarılı!`, ephemeral: true });
      };

      if (!config.employee && !m.permissions.has("ManageGuild")) return interaction.reply({
        embeds: [
          new this.Embed({
            title: `${this.client.user.username} - Abone Sistemi | Ayarlanmamış`,
            description: `${this.config.Emoji.State.ERROR} Abone sistemini \`Sunucuyu Yönet\` yetkisi olan birisinden ayarlamasını isteyiniz.`
          })
        ],

        ephemeral: true
      });

      if (!m.roles.cache.has(config.employee)) return interaction.reply({
        embeds: [
          new this.Embed({
            title: `${this.client.user.username} - Abone Sistemi | Yetersiz Yetki & İzin`,
            description: `${this.config.Emoji.State.ERROR} Bu komutu kullanmak için yetkiniz yetmiyor.`,
            fields: [
              {
                name: `${this.config.Emoji.Other.ADMIN} Gerekli Rol`,
                value: `- \`${(await this.roles.get(guild.id, config.employee)).name}\``
              }
            ]
          })
        ],
        ephemeral: true
      });

      if (options.getSubcommand(false) === "add") {
        const user = options.getUser("mention");
        const member = await guild.members.resolve(user.id);

        const subscribeRole = await this.roles.get(guild.id, config.subscribe);

        if (!member) return interaction.reply({
          embeds: [
            new this.Embed({
              title: `${this.client.user.username} - Abone Sistemi | Geçersiz Kullanıcı`,
              description: `${this.config.Emoji.State.ERROR} Bu kullanıcı sunucuda bulunmuyor.`,
              thumbnail: {
                url: interaction.user?.avatarURL()
              },
              footer: {
                text: `> Daha sonra tekrar deneyin.`
              }
            })
          ]
        });

        if (db.has(`BlackList.Member_${member.id}`)) {
          const time = db.fetch(`BlackList.Member_${member.id}.Date`);
          const reason = db.fetch(`BlackList.Member_${member.id}.Reason`);
          const author = db.fetch(`BlackList.Member_${member.id}.Employee`);

          return interaction.reply({
            embeds: [
              new this.Embed({
                title: `${this.client.user.username} - Abone Sistemi | KaraListe Kullanıcısı`,
                description: `${this.config.Emoji.Other.TRASH} Bu kullanıcı kara listede bulunuyor.`,
                fields: [
                  {
                    name: `${this.config.Emoji.Other.ADMIN} Yetkili`,
                    value: `- <@${(await this.members.get(guild.id, author)).id}>`,
                    inline: true
                  },
                  {
                    name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
                    value: `- <t:${time}:R>`,
                    inline: true
                  },
                  {
                    name: `${this.config.Emoji.Other.NOTEPAD} Sebep`,
                    value: `- ${reason}`
                  }
                ],
                thumbnail: {
                  url: member?.displayAvatarURL()
                }
              })
            ]
          });
        };

        if (member.roles.cache.has(config.subscribe)) return interaction.reply({
          embeds: [
            new this.Embed({
              title: `${this.client.user.username} - Abone Sistemi | Rol Mevcut`,
              description: `${this.config.Emoji.State.WARNING} Bu kullanıcının \`${subscribeRole.name}\` isimli abone rolü mevcut!`,
              thumbnail: {
                url: interaction.user?.avatarURL()
              },
              fields: [
                {
                  name: `${this.config.Emoji.Other.EDITOR} Kontrol Et`,
                  value: `- \`/subscribe state mention:${member}\``
                }
              ]
            })
          ]
        });


        const date = Math.floor(Date.now() / 1000);
        const formattedDate = `<t:${date}:R>`;

        member.roles.add(config.subscribe);

        if (interaction.channel.id === config.subscribeChannel) {
          db.add(`Subscribe.Employee_${m.id}.Count`, 1);
          db.set(`Subscribe.Employee_${m.id}.Date`, date);
        };

        db.set(`Subscribe.Member_${member.id}`, {
          Role: true,
          Employee: m.id,
          Date: date
        });

        db.push(`Subscribe.Members`, member.id);

        if (member.roles.highest.id === config.subscribe) member.displayName.startsWith("🔰") ? null : member.setNickname(`🔰 ${member.displayName}`);

        const subscribeCount = db.fetch(`Subscribe.Employee_${m.id}.Count`) ?? 0;

        const subEmbed = new this.Embed({
          title: `${client.user.username} - Abone Sistemi | Rol Verildi`,
          description: `${this.config.Emoji.State.SUCCESS} ${member} kullanıcısına \`${subscribeRole.name}\` isimli abone rolü verildi!`,
          footer: {
            text: `${interaction.user.tag}, ${subscribeCount} tane Abone Rol kayıtınız var!`,
            iconURL: interaction.user?.avatarURL()
          },
          fields: [
            {
              name: `${this.config.Emoji.State.INFORMATION} Rolü Al`,
              value: `- \`/subscribe delete mention:${member.id}\``
            },
            {
              name: `${this.config.Emoji.State.INFORMATION} Kontrol Et`,
              value: `- \`/subscribe state mention:${member.id}\``
            }
          ],
          thumbnail: {
            url: member?.displayAvatarURL()
          }
        });

        const logEmbed = new this.Embed({
          title: `${client.user.username} - Abone Sistemi | Rol Verildi`,
          description: `${this.config.Emoji.State.SUCCESS} Abone rolü verildi!`,
          footer: {
            text: `${interaction.user.tag}, ${subscribeCount} tane Abone Rol kayıtınız var!`,
            iconURL: interaction.user?.avatarURL()
          },
          fields: [
            {
              name: `${this.config.Emoji.Other.USER} Kullanıcı`,
              value: `- ${member}`,
              inline: true
            },
            {
              name: `${this.config.Emoji.Other.ADMIN} Yetkili`,
              value: `- ${m}`,
              inline: true
            },
            {
              name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
              value: `- ${formattedDate}`,
              inline: true
            }
          ],
          thumbnail: {
            url: member?.displayAvatarURL()
          }
        });

        this.client.channels.resolve((await this.channels.get(config.log)).id).send({ embeds: [logEmbed] });
        return interaction.reply({ embeds: [subEmbed] });
      } else if (options.getSubcommand(false) === "delete") {
        const user = options.getUser("mention");
        const member = this.members.cache.get(user.id);

        const subscribeRole = await this.roles.get(guild.id, config.subscribe);

        if (!member) return interaction.reply({
          embeds: [
            new this.Embed({
              title: `${this.client.user.username} - Abone Sistemi | Geçersiz Kullanıcı`,
              description: `${this.config.Emoji.State.ERROR} Bu kullanıcı sunucuda bulunmuyor. Lütfen geliştiriciden beni yeniden başlatmasını isteyiniz.`,
              thumbnail: {
                url: interaction.user?.avatarURL()
              },
              footer: {
                text: `> Daha sonra tekrar deneyin.`
              }
            })
          ]
        });

        if (db.has(`BlackList.Member_${member.id}`)) {
          const time = db.fetch(`BlackList.Member_${member.id}.Date`);
          const reason = db.fetch(`BlackList.Member_${member.id}.Reason`);
          const author = db.fetch(`BlackList.Member_${member.id}.Employee`);

          if (member.roles.cache.has(config.subscribe)) {

            if (member.roles.highest.id === config.subscribe) member.displayName.startsWith("🔰") ? member.setNickname(String(member.displayName).slice(1)) : null;

            member.roles.remove(config.subscribe);
          };

          return interaction.reply({
            embeds: [
              new this.Embed({
                title: `${this.client.user.username} - Abone Sistemi | KaraListe Kullanıcısı`,
                description: `${this.config.Emoji.Other.TRASH} Bu kullanıcı kara listede bulunuyor.`,
                fields: [
                  {
                    name: `${this.config.Emoji.Other.ADMIN} Yetkili`,
                    value: `- <@${(await this.members.get(guild.id, author)).id}>`,
                    inline: true
                  },
                  {
                    name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
                    value: `- <t:${time}:R>`,
                    inline: true
                  },
                  {
                    name: `${this.config.Emoji.Other.NOTEPAD} Sebep`,
                    value: `- ${reason}`
                  }
                ],
                thumbnail: {
                  url: member?.displayAvatarURL()
                }
              })
            ]
          });
        };

        if (!member.roles.cache.has(config.subscribe)) return interaction.reply({
          embeds: [
            new this.Embed({
              title: `${this.client.user.username} - Abone Sistemi | Rol Mevcut Değil`,
              description: `${this.config.Emoji.State.WARNING} Bu kullanıcının \`${subscribeRole.name}\` isimli rolü zaten mevcut değil!`,
              thumbnail: {
                url: interaction.user?.avatarURL()
              }
            })
          ]
        });

        const date = Math.floor(Date.now() / 1000);
        const formattedDate = `<t:${date}:R>`;

        member.roles.remove(config.subscribe);

        db.sub(`Subscribe.Employee_${m.id}.Count`, 1);
        db.del(`Subscribe.Member_${member.id}`);
        db.pull(`Subscribe.Members`, (data) => data === member.id);

        if (member.roles.highest.id === config.subscribe) String(member.displayName).startsWith("🔰") ? member.setNickname(String(member.displayName).slice(1)) : null;

        const subscribeCount = db.fetch(`Subscribe.Employee_${m.id}.Count`) ?? 0;

        const subEmbed = new this.Embed({
          title: `${client.user.username} - Abone Sistemi | Rol Alındı`,
          description: `${this.config.Emoji.State.SUCCESS} ${member} kullanıcısından \`${subscribeRole.name}\` isimli rol alındı!`,
          footer: {
            text: `${interaction.user.tag}, ${subscribeCount} tane Abone Rol kayıtınız var!`,
            iconURL: interaction.user?.avatarURL()
          },
          fields: [
            {
              name: `${this.config.Emoji.State.INFORMATION} Rolü Ver`,
              value: `- \`/subscribe add mention:${member.id}\``
            }
          ],
          thumbnail: {
            url: member?.displayAvatarURL()
          }
        });

        const logEmbed = new this.Embed({
          title: `${client.user.username} - Abone Sistemi | Rol Alındı`,
          description: `${this.config.Emoji.State.SUCCESS} Abone rolü alındı!`,
          footer: {
            text: `${interaction.user.tag}, ${subscribeCount} tane Abone Rol kayıtınız var!`,
            iconURL: interaction.user?.avatarURL()
          },
          fields: [
            {
              name: `${this.config.Emoji.Other.USER} Kullanıcı`,
              value: `- ${member}`,
              inline: true
            },
            {
              name: `${this.config.Emoji.Other.ADMIN} Yetkili`,
              value: `- ${m}`,
              inline: true
            },
            {
              name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
              value: `- ${formattedDate}`,
              inline: true
            }
          ],
          thumbnail: {
            url: member?.displayAvatarURL()
          }
        });

        this.client.channels.resolve((await this.channels.get(config.log)).id).send({ embeds: [logEmbed] });
        return interaction.reply({ embeds: [subEmbed] });
      } else if (options.getSubcommand(false) === "state") {
        const user = options.getUser("mention");
        const member = this.members.cache.get(user.id);

        const subscribeRole = await this.roles.get(guild.id, config.subscribe);

        if (!member.roles.cache.has(config.employee)) {
          if (!member.roles.cache.has(config.subscribe)) return interaction.reply({
            embeds: [
              new this.Embed({
                title: `${this.client.user.username} - Abone Sistemi | Rol Mevcut Değil`,
                description: `${this.config.Emoji.State.WARNING} Bu kullanıcının \`${subscribeRole.name}\` isimli abone rolü mevcut değil!`,
                thumbnail: {
                  url: interaction.user?.avatarURL()
                },
                fields: [
                  {
                    name: `${this.config.Emoji.Other.EDITOR} Rolü Ver`,
                    value: `- \`/subscribe add mention:${member.id}\``
                  }
                ]
              })
            ]
          });

          const date = db.fetch(`Subscribe.Member_${member.id}.Date`);
          const employee = await guild.members.resolve(db.fetch(`Subscribe.Member_${member.id}.Employee`));

          const subscribeCount = Number(db.fetch(`Subscribe.Employee_${employee.id}.Count`) ?? 0);

          const embed = new this.Embed({
            title: `${this.client.user.username} - Abone Sistemi | Kullanıcı Bilgisi`,
            description: `${this.config.Emoji.State.INFORMATION} ${member} kişisinin abone bilgilerini görüntülüyorsunuz.`,
            fields: [
              {
                name: `${this.config.Emoji.Other.USER} Yetkili`,
                value: `- ${employee} \`(${subscribeCount})\``,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
                value: `- <t:${date}:R>`,
                inline: true
              }
            ],
            thumbnail: {
              url: member?.displayAvatarURL()
            }
          });

          return interaction.reply({ embeds: [embed] });
        } else {
          const date = db.fetch(`Subscribe.Employee_${member.id}.Date`);
          const subscribeCount = Number(db.fetch(`Subscribe.Employee_${member.id}.Count`) ?? 0);

          const embed = new this.Embed({
            title: `${this.client.user.username} - Abone Sistemi | Görevli Bilgisi`,
            description: `${this.config.Emoji.State.INFORMATION} ${member} görevlisinin abone bilgilerini görüntülüyorsunuz.`,
            fields: [
              {
                name: `${this.config.Emoji.Other.USER} Toplam Kayıt`,
                value: `- ${subscribeCount}`,
                inline: true
              },
              {
                name: `${this.config.Emoji.Other.CALENDAR} Tarih`,
                value: `- <t:${date}:R>`,
                inline: true
              }
            ],
            thumbnail: {
              url: member?.displayAvatarURL()
            }
          });

          return interaction.reply({ embeds: [embed] });
        };
      } else if (options.getSubcommand(false) === "list") {
        const data = new CacheManager();

        await interaction.reply({ embeds: [new this.Embed({ description: `${this.config.Emoji.State.LOADING} Veriler yükleniyor...` })] });

        const guild = await this.client.guilds.resolve((await this.client.channels.resolve(config.log)).guild.id);

        let cont = "";

        const embeds = [];

        await Promise.all(guild.members.cache.filter((member) => member.roles.cache.has(config.employee)).map(async (member) => {
          const subCount = Number(db.fetch(`Subscribe.Employee_${member.id}.Count`) ?? 0);
          const date = db.fetch(`Subscribe.Employee_${member.id}.Date`);

          const user = await this.client.users.fetch(member.id);

          if (subCount >= 0) {
            const name = (additional) => String(member.displayName).toLowerCase().endsWith(additional);

            if (name("a")) cont = "nın";
            else if (name("b")) cont = "ın";
            else if (name("c")) cont = "ın";
            else if (name("d")) cont = "ın";
            else if (name("e")) cont = "nin";
            else if (name("f")) cont = "un";
            else if (name("h")) cont = "ın";
            else if (name("k")) cont = "ın";
            else if (name("ı")) cont = "nın";
            else if (name("n")) cont = "in";
            else if (name("p")) cont = "un";
            else if (name("r")) cont = "in";
            else if (name("l")) cont = "ün";
            else if (name("u")) cont = "nun";
            else if (name("i")) cont = "nin";
            else if (name("t")) cont = "in";
            else if (name("m")) cont = "in";
            else cont = "nin";

            return data.set(member.id, {
              Count: subCount,
              Message: `<@${member.id}>'${cont}`,
              LastGavedRoleDate: date ? `<t:${date}:R>` : null,
              Member: member,
              User: user
            });
          };
        }));

        await Promise.all(data.map((a) => a).sort((a, b) => b.Count - a.Count).map((data, index) => {
          return embeds.push(new this.Embed({
            title: `${this.client.user.username} - Abone Sistemi | Sıralama #${index + 1}`,
            description: `
            ${this.config.Emoji.Other.USER} ${data.Member} (${data.User.tag} | ${data.Member.id})

            ${this.config.Emoji.Other.CHAT} ${data.Count}
            ${this.config.Emoji.Other.CALENDAR} ${data.LastGavedRoleDate ? data.LastGavedRoleDate : "Bilinmiyor"}
            `,
            thumbnail: {
              url: data.Member?.displayAvatarURL()
            }
          }));
        }));

        return await this.pagination(interaction, { embeds });
      };
    };
  };
};