export const Turkish = {
  data: {
    permissions: {
      body: "{p}",

      CreateInstantInvite: "Davet Oluştur",
      KickMembers: "Üyeleri At",
      BanMembers: "Üyeleri Yasakla",
      Administrator: "Yönetici",
      ManageChannels: "Kanalları Yönet",
      ManageGuild: "Sunucuyu Yönet",
      AddReactions: "Tepki Ekle",
      ViewAuditLog: "Denetim Kaydını Görüntüle",
      PrioritySpeaker: "Öncelikli Konuşmacı",
      Stream: "Yayın",
      ViewChannel: "Kanalı Görüntüle",
      SendMessages: "Mesaj Gönder",
      SendTTSMessages: "Sesli Mesaj Gönder",
      ManageMessages: "Mesajları Yönet",
      EmbedLinks: "Gömülü Mesajlar",
      AttachFiles: "Dosya Ekle",
      ReadMessageHistory: "Mesaj Geçmişini Oku",
      MentionEveryone: "Herkesten Bahset",
      UseExternalEmojis: "Harici Emojiler Kullan",
      ViewGuildInsights: "Sunucu Bilgilerini Görüntüle",
      Connect: "Bağlan",
      Speak: "Konuş",
      MuteMembers: "Kullanıcıları Sustur",
      DeafenMembers: "Kullanıcıları Sağırlaştır",
      MoveMembers: "Kullanıcıları Taşı",
      UseVad: "Kullanıcı Etkinlikleri",
      ChangeNickname: "Kullanıcı Adını Değiştir",
      ManageNicknames: "Kullanıcı Adlarını Yönet",
      ManageRoles: "Rolleri Yönet",
      ManageWebhooks: "Webhookları Yönet",
      ManageEmojisAndStickers: "Emojileri ve Çıkartmaları Yönet",
      UseApplicationCommands: "Uygulama Komutlarını Kullan",
      RequestToSpeak: "Konuşma İzni İste",
      ManageEvents: "Etkinlikleri Yönet",
      ManageThreads: "Alt Başlıkları Yönet",
      CreatePublicThreads: "Herkese Açık Alt Başlıklar Oluştur",
      CreatePrivateThreads: "Herkese Kapalı Alt Başlıklar Oluştur",
      UseExternalStickers: "Harici Çıkartmalar Kullan",
      SendMessagesInThreads: "Alt Başlıklarda Mesaj Gönder",
      UseEmbeddedActivities: "Gömülü Etkinlikleri Kullan",
      ModerateMembers: "Üyelere Zaman Aşımı Uygula"
    },
    loader: {
      nodeError: "Proje, bu NodeJS sürümüyle uyumlu değil.",
      handlers: {
        loading: "İşleyiciler Yükleniyor ({loaded}/{total})",
        loadingError: "İşleyiciler yüklenirken bir hata oluştu. | {err}",
        loaded: "İşleyiciler Yüklendi. ({loaded}/{total})"
      },
      events: {
        loading: "Etkinlikler Yükleniyor ({loaded}/{total})",
        loadingError: "Etkinlikler yüklenirken bir hata oluştu. | {err}",
        loaded: "Etkinlikler Yüklendi. ({loaded}/{total})"
      },
      commands: {
        loading: "Komutlar Yükleniyor ({loaded}/{total})",
        loadingError: "Komutlar yüklenirken bir hata oluştu. | {err}",
        loaded: "Komutlar Yüklendi. ({loaded}/{total})"
      },
      languages: {
        loading: "Diller Yükleniyor ({loaded}/{total})",
        loadingError: "Diller yüklenirken bir hata oluştu. | {err}",
        loaded: "Diller Yüklendi. ({loaded}/{total})"
      },
      gateway: {
        connecting: "Ağ Geçidine Bağlanılıyor ({processing}/{total})",
        connectionError: "Ağ Geçidine bağlanırken bir hata oluştu. | {err}",
        connected: "Ağ Geçidine Bağlanıldı. ({processing}/{total})"
      }
    },
    events: {
      util: {
        register: {
          title: "Kayıt Sistemi",
          user: "Kullanıcı",
          name: "İsim",
          employee: "Yetkili",
          totalRegisterCount: "{user.tag}, Toplam {count} kayıtınız var!",
          editMemberName: "Kullanıcı Adını Düzenle"
        },
        ready: {
          blacklist: {
            title: "{client.user.tag} - Kara Liste | Eklendi",
            description: "{successEmote} Bir kullanıcı karalisteye eklendi.",
            fields: {
              employee: "{employeeEmote} Yetkili",
              date: "{calendarEmote} Tarih"
            }
          }
        },
        message: {
          blacklist: {
            title: "{client.user.tag} - Abone Sistemi | KaraListe Kullanıcısı",
            description: "{trashEmote} Maalesef, karalistede bulunuyorsun aşağıdan neden karalistede olduğun hakkında bilgi edin!",
            fields: {
              employee: "{employeeEmote} Yetkili",
              date: "{calendarEmote} Tarih",
              reason: "{notepadEmote} Sebep"
            }
          },
          subscribe: {
            title: "{client.user.username} - Abone Sistemi",
            description: `Attığın Fotoğraf Eğer \`SON VIDEO\` __**DEĞİL**__ ise \`Like\`, \`Yorum\` ve \`Bildirim\` __**YOKSA**__ Abone Rolünüz __**VERİLME*Z***__ \n\n**Bilgisayar Saatinin Gözüktüğünden __EMİN OL__**`,
            fields: {
              add: "{checkEmote} Rolü Ver"
            }
          }
        }
      },
      handlers: {
        interaction: {
          developerMessage: "{errorEmote} {member}, Sen {client.user} geliştiricisi olduğuna emin misin?",
          error: {
            userData: {
              title: "{errorEmote} Bir hata oluştu.",
              description: "{notepadEmote} Hata geliştiricilere iletildi.",
              footer: {
                text: "> Lütfen daha sonra tekrar kontrol edin."
              }
            },
            reportData: {
              title: "{errorEmote} Komut kullanılırken bir hata oluştu.",
              description: "```js\n{err}```",
              fields: {
                author: "{userEmote} Kullanıcı",
                time: "{calendarEmote} Tarih",
                command: "{prototipEmote} Komut"
              }
            }
          },
          permission: {
            title: "{permissionEmote} Yetersiz Yetki",
            description: "{errorEmote} Bu komutu kullanmak için yetkiniz yetersiz.",
            fields: {
              required: "{editorEmote} Gerekli Yetkiler"
            }
          }
        }
      }
    }
  }
};