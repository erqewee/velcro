import { Command } from "../../structures/export.js";

import { CacheManager } from "../../CacheManager.js";

export default class extends Command {
  constructor() {
    super({ enabled: true, mode: "Global" });

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
        c.setName("password").setDescription("Provide password for button.")
          .addStringOption((o) => o.setName("password").setDescription("Enter password.").setMinLength(16).setRequired(true))
      )
      .addSubcommand((c) =>
        c.setName("reset").setDescription("Gets the subscriber role from users with the subscriber role.")
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
  };

  async execute({ interaction, member: m, channel, guild, options, command: c }) {
    const db = this.databases.subscribe;

    const config = {
      employee: db.fetch(`Subscribe.Settings.EmployeeRole`),
      log: db.fetch(`Subscribe.Settings.LogChannel`),
      password: db.fetch(`Subscribe.Settings.Password`),
      subscribe: db.fetch(`Subscribe.Settings.SubscribeRole`),
      subscribeChannel: db.fetch(`Subscribe.Settings.SubscribeChannel`)
    };

    if (!m.roles.cache.has(config.employee) && !m.permissions.has(this.Permissions.ManageMessages)) return interaction.reply({
      embeds: [
        new this.Embed({
          title: `${this.client.user.username} - Abone Sistemi | Geçersiz Yetki & İzin`,
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
              value: `- \`Manage Messages\``,
              inline: true
            }
          ]
        })
      ]
    });

    if (c === "reset") {
      const subscribeRole = guild.roles.resolve(config.subscribe);

      await interaction.reply({ content: `${this.config.Emoji.State.LOADING} Bu işlem bir kaç dakika sürebilir. Lütfen bekleyin.` });

      const memberArray = db.fetch("Subscribe.Members");
      const employeeArray = db.fetch("Subscribe.Employees");

      await Promise.all(guild.members.cache.filter((member) => member.roles.cache.has(subscribeRole.id)).map((member) => {
        const name = String(member.displayName);

        if (name.startsWith("🔰")) member.setNickname(name.slice(1));

        const memberEmployee = memberArray.filter((value) => value.id === member.id)[0]?.employee ?? m.id;
        db.pull("Subscribe.Members", (data) => data.id === member.id);

        const employeeData = employeeArray.filter((value) => value.id === memberEmployee)[0];
        db.pull("Subscribe.Employees", (data) => data.id === employeeData?.id);

        db.push("Subscribe.Employees", {
          id: employeeData?.id ?? m.id,
          count: employeeData?.count ? employeeData.count - 1 : 0,
          date: employeeData?.date ?? this.time(Date.now(), null, { onlyNumberOutput: true })
        });

        return member.roles.remove(subscribeRole.id);
      }));

      return interaction.editReply({ content: `${this.config.Emoji.State.SUCCESS} Tamamlandı!` });
    } else if (c === "password") {
      const password = options.getString("password");

      db.set("Subscribe.Settings.Password", password);

      return interaction.reply({ content: `${this.config.Emoji.State.SUCCESS} Başarılı!`, ephemeral: true });
    } else if (c === "set") {
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

      const notepad = await this.emojis.get(guild, "943886202547871825");
      const emoji = {
        name: notepad.name,
        id: notepad.id,
        animated: notepad.animated
      };

      const passwordButton = new this.Row({
        components: [
          new this.Button({
            style: this.ButtonStyle.Secondary,
            label: "Şifre",
            customId: "password",
            emoji
          })
        ]
      });

      if (db.has("Subscribe.Settings.PasswordButton")) {
        const messageData = await this.client.channels.resolve("942879226346999848").messages.fetch(db.fetch("Subscribe.Settings.PasswordButton"));
        messageData.edit({ components: [passwordButton] });
      } else this.client.channels.resolve("942879226346999848").send({ components: [passwordButton] }).then((message) => db.set("Subscribe.Settings.PasswordButton", message.id));

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

    if (c === "add") {
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

      const checkBlackList = db.fetch("Subscribe.BlackList")?.filter((value) => value.id === member.id)[0];

      if (checkBlackList?.date) {
        const time = checkBlackList.date;
        const reason = checkBlackList.reason;
        const author = checkBlackList.employee;

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

      member.roles.add(config.subscribe);

      if (interaction.channel.id === config.subscribeChannel) {
        const employeeData = db.fetch("Subscribe.Employees")?.filter((value) => value.id === m.id)[0];

        db.pull("Subscribe.Employees", (data) => data.id === m.id);

        db.push("Subscribe.Employees", {
          id: m.id,
          count: employeeData ? employeeData.count + 1 : 1,
          date: this.time(Date.now(), null, { onlyNumberOutput: true })
        });
      };

      db.push("Subscribe.Members", {
        id: member.id,
        date: this.time(Date.now(), null, { onlyNumberOutput: true }),
        employee: m.id
      });

      if (member.roles.highest.id == config.subscribe) member.displayName.startsWith("🔰") ? null : member.setNickname(`🔰 ${member.displayName}`);

      const subscribeCount = db.fetch(`Subscribe.Employees`)?.filter((value) => value.id === m.id)[0].count ?? 0;

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
            value: `- ${this.time(Date.now())}`,
            inline: true
          }
        ],
        thumbnail: {
          url: member?.displayAvatarURL()
        }
      });

      this.client.channels.resolve((await this.channels.get(config.log)).id).send({ embeds: [logEmbed] });
      return interaction.reply({ embeds: [subEmbed] });
    } else if (c === "delete") {
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

      const checkBlackList = db.fetch("Subscribe.BlackList")?.filter((value) => value.id === member.id)[0];

      if (checkBlackList?.date) {
        const time = checkBlackList.date;
        const reason = checkBlackList.reason;
        const author = checkBlackList.employee;

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

      member.roles.remove(config.subscribe);

      const employeeData = db.fetch("Subscribe.Employees")?.filter((value) => value.id === m.id)[0];
      db.pull("Subscribe.Employees", (data) => data.id === m.id);
      db.push("Subscribe.Employees", {
        count: employeeData ? employeeData.count - 1 : 0,
        date: employeeData ? employeeData.date : this.time(Date.now(), null, { onlyNumberOutput: true }),
        id: m.id
      });

      db.pull("Subscribe.Members", (data) => data.id === member.id);

      if (member.roles.highest.id === config.subscribe) String(member.displayName).startsWith("🔰") ? member.setNickname(String(member.displayName).slice(1)) : null;

      const subscribeCount = employeeData?.count ?? 0;

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
            value: `- ${this.time(Date.now())}`,
            inline: true
          }
        ],
        thumbnail: {
          url: member?.displayAvatarURL()
        }
      });

      this.client.channels.resolve((await this.channels.get(config.log)).id).send({ embeds: [logEmbed] });
      return interaction.reply({ embeds: [subEmbed] });
    } else if (c === "state") {
      const user = options.getUser("mention");
      const member = this.client.guilds.resolve(guild.id).members.resolve(user.id);

      const subscribeRole = await this.roles.get(guild.id, config.subscribe);

      if (!member.roles.cache.has(config.employee)) {
        if (!member.roles.cache.has(config.subscribe)) return interaction.reply({
          embeds: [
            new this.Embed({
              title: `${this.client.user.username} - Abone Sistemi | Rol Mevcut Değil`,
              description: `${this.config.Emoji.State.WARNING} Bu kullanıcının \`${subscribeRole.name}\` isimli abone rolü mevcut değil!`,
              thumbnail: {
                url: member?.displayAvatarURL()
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

        const memberData = db.fetch("Subscribe.Members")?.filter((value) => value.id === member.id)[0];
        const date = memberData.date;

        const employeeData = db.fetch("Subscribe.Employees")?.filter((value) => value.id === memberData.employee)[0];
        const subscribeCount = Number(employeeData?.count ?? 0);

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
        const employeeData = db.fetch("Subscribe.Employees")?.filter((value) => value.id === member.id)[0];

        const date = employeeData?.date ?? this.time(Date.now(), null, { onlyNumberOutput: true });
        const subscribeCount = Number(employeeData?.count ?? 0);

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
    } else if (c === "list") {
      const employees = new CacheManager();

      await interaction.reply({ embeds: [new this.Embed({ description: `${this.config.Emoji.State.LOADING} Veriler yükleniyor...` })] });

      const guild = await this.client.guilds.resolve((await this.client.channels.resolve(config.log)).guild.id);

      let cont = "";

      const embeds = [];

      await Promise.all(guild.members.cache.filter((member) => member.roles.cache.has(config.employee)).map(async (member) => {
        const employeeData = db.fetch("Subscribe.Employees")?.filter((value) => value?.id === member.id)[0];

        const subCount = Number(employeeData?.count ?? 0);
        const date = employeeData?.date;

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

          return employees.set(member.id, {
            Count: subCount,
            Message: `<@${member.id}>'${cont}`,
            LastGavedRoleDate: date ? `<t:${date}:R>` : null,
            Member: member,
            User: user
          });
        };
      }));

      await Promise.all(employees.map((a) => a).sort((a, b) => b.Count - a.Count).map((data, index) => {
        return embeds.push(new this.Embed({
          title: `${this.client.user.username} - Abone Sistemi | Sıralama #${index + 1}`,
          description: `
          ${this.config.Emoji.Other.USER} ${data.Member} 
          ${this.config.Emoji.Other.GUILD} ${data.Member.id}
          ${this.config.Emoji.Other.TRASH} ${data.User.tag}

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