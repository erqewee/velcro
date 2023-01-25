export const Turkish = {
  data: {
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
          }
        }
      }
    }
  }
};