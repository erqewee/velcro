export default {
  enabled: false,
  data: {
    permissions: {
      body: "{p}",

      "CreateInstantInvite": "Dəvət yarat",
      "KickMembers": "KickMembers",
      "BanMembers": "Üzvləri Qadağa",
      "Administrator": "Administrator",
      "ManageChannels": "Kanalları idarə et",
      "ManageGuild": "Serveri idarə et",
      "AddReactions": "Reaksiya əlavə et",
      "ViewAuditLog": "Audit jurnalına baxın",
      "PrioritySpeaker": "Prioritet Natiq",
      "Stream": "Yayım",
      "ViewChannel": "Kanala bax",
      "SendMessages": "Mesaj göndər",
      "SendTTSMessages": "Səsli Mesaj Göndər",
      "Mesajları idarə et": "Mesajları idarə et",
      "EmbedLinks": "Daxil edilmiş mesajlar",
      "AttachFiles": "Fayl əlavə et",
      "ReadMessageHistory": "Mesaj Tarixçəsini Oxu",
      "Everyone Mention": "Hər kəsə deyin",
      "UseExternalEmojis": "Xarici Emojilərdən istifadə edin",
      "ViewGuildInsights": "Server məlumatlarına baxın",
      "Connect": "Bağla",
      "Speak": "Danış",
      "MuteMembers": "Sessiz İstifadəçilər",
      "DeafenMembers": "Deafen İstifadəçilər",
      "MoveMembers": "İstifadəçiləri köçürün",
      "UseVad": "İstifadəçi hadisələri",
      "ChangeNickname": "İstifadəçi adını dəyişdirin",
      "ManageNicknames": "İstifadəçi adlarını idarə et",
      "ManageRoles": "Rolları idarə et",
      "ManageWebhooks": "Webhooks idarə et",
      "ManageEmojisAndStickers": "Emojiləri və Etiketləri idarə et",
      "UseApplicationCommands": "Use Application commands",
      "RequestToSpeak": "Danışmaq üçün icazə tələb et",
      "ManageEvents": "Tədbirləri idarə et",
      "ManageThreads": "Altyazıları idarə et",
      "CreatePublicThreads": "Create Public Subtitles",
      "CreatePrivateThreads": "İctimai üçün Qapalı Altyazılar Yaradın",
      "UseExternalStickers": "Xarici Etiketlərdən istifadə edin",
      "SendMessagesInThreads": "Alt Mövzularda Mesaj Göndər",
      "UseEmbeddedActivities": "İstifadə Edilmiş Fəaliyyətlər",
      "ModerateMembers": "Müddət Aşımı Üzvləri"
    },
    loader: {
      nodeError: "Layihə NodeJS-in bu versiyası ilə uyğun deyil.",
      handlers: {
        loading: "Yükləmə İşləyiciləri ({loaded}/{total})",
        loadingError: "İşləyiciləri yükləyərkən xəta baş verdi. | {err}",
        loaded: "İşləyicilər Yükləndi. ({loaded}/{total})"
      },
      events: {
        loading: "Hadisələr yüklənir ({loaded}/{total})",
        loadingError: "Hadisələri yükləyərkən xəta baş verdi. | {err}",
        loaded: "Fəaliyyətlər Yükləndi. ({loaded}/{total})"
      },
      commands: {
        loading: "Əmrlər Yüklənir ({loaded}/{total})",
        loadingError: "Əmrləri yükləyərkən xəta baş verdi. | {err}",
        loaded: "Əmrlər Yükləndi. ({loaded}/{total})"
      },
      languages: {
        loading: "Dillər Yüklənir ({loaded}/{total})",
        loadingError: "Dilləri yükləyərkən xəta baş verdi. | {err}",
        loaded: "Dillər Yükləndi. ({loaded}/{total})"
      },
      Gateway: {
        connecting: "Gateway-ə qoşulma ({processing}/{total})",
        connectionError: "Gateway-ə qoşulma zamanı xəta baş verdi. | {err}",
        connected: "Gateway-ə qoşuldu. ({processing}/{total})"
      }
    },
    events: {
      util: {
        register: {
          title: "Qeydiyyat Sistemi",
          user: "İstifadəçi",
          name: "Ad",
          employee: "səlahiyyətli",
          totalRegisterCount: "{user.tag}, Sizin cəmi {count} qeydiniz var!",
          editMemberName: "İstifadəçi adını redaktə et"
        },
        ready: {
          blacklist: {
            title: "{client.user.tag} - Qara siyahı | Əlavə edilib",
            description: "{successEmote} İstifadəçi qara siyahıya salınıb.",
            fields: {
              employee: "{employeeEmote} Səlahiyyətli",
              date: "{calendarEmote} Tarix"
            }
          }
        },
        message: {
          blacklist: {
            title: "{client.user.tag} - Abunəçi Sistemi | Qara Siyahı İstifadəçi",
            description: "{trashEmote} Üzr istəyirik, siz qara siyahıya düşmüsünüz, lütfən, aşağıda niyə qara siyahıya salındığınızı mənə bildirin!",
            fields: {
              employee: "{employeeEmote} Səlahiyyətli",
              time: "{calendarEmote} Tarix",
              reason: "{notepadEmote} Səbəb"
            }
          },
          subscribe: {
            title: "{client.user.username} - Abunəçi Sistemi",
            description: `Təqdim etdiyiniz Şəkil \`SON VİDEO\` DEYİLDƏ __**DEYİL**__ \`Bəyən\`, \`Şərh\` və \`Bildiriş\` __** ƏGƏR **__ Abunəçiniz Rol __**VERİLMƏYİR**__ \n\n**Kompüter Saatının Göründüyünə ƏMİN OLUN__**`,
            fields: {
              add: "{checkEmote} rolunu verin"
            }
          }
        }
      },
      handlers: {
        interaction: {
          developerMessage: "{errorEmote} {üzv}, {client.user} tərtibatçısı olduğunuza əminsiniz?",
          error: {
            userData: {
              title: "{errorEmote} Xəta baş verdi.",
              description: "{notepadEmote} Xəta tərtibatçılara bildirildi.",
              fields: {
                text: "> Lütfən, sonra yenidən yoxlayın."
              }
            },
            reportData: {
              title: "{errorEmote} əmrindən istifadə edərkən xəta baş verdi.",
              description: "```js\n{err}```",
              fields: {
                author: "{userEmote} İstifadəçi",
                time: "{calendarEmote} Tarix",
                command: "{prototypeEmote} Komanda"
              }
            }
          }
        }
      }
    },
    commands: {
      avatar: {
        title: "{member}'s Avatar",
      }
    }
  }
};