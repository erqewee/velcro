import { SlashCommand } from "../../../structures/export.js";

import ms from "ms";

const rules = [
  {
    name: "Reklam yapmak yasaktır. (DM Dahildir.)",
    value: "1"
  },
  {
    name: "Küfür ve Argo kullanımı yasaktır. (Videolar Dahildir.)",
    value: "2"
  },
  {
    name: "+18, Cinsellik ve benzeri şeyler yapmak yasaktır.",
    value: "3"
  },
  {
    name: "Sunucudaki üyeleri taciz etmek yasaktır.",
    value: "4"
  },
  {
    name: "Ticaret yapmak yasaktır.",
    value: "5"
  },
  {
    name: "Herkes saygılı olmalıdır.",
    value: "6"
  },
  {
    name: "Kanallar amacına göre kullanılmalıdır.",
    value: "7"
  },
  {
    name: "Discord ToS kurallarını ihlal etmek yasaktır.",
    value: "8"
  },
  {
    name: "Yetkililerin işine karışmak yasaktır.",
    value: "9"
  },
  {
    name: "Tartışma çıkarmak, tartışmaya dahil olmak yasaktır.",
    value: "10"
  },
  {
    name: "Yönetim kararına karşı çıkmak yasaktır.",
    value: "11"
  },
  {
    name: "Üstünlük göstermek yasaktır.",
    value: "12"
  },
  {
    name: "Yetki & Rol istemek yasaktır.",
    value: "13"
  },
  {
    name: "Din, Dil, Irk ve Ayrımcılığı yapmak yasaktır.",
    value: "14"
  },
  {
    name: "Sunucuda 'owo' kanalları dışında owo oynamak yasaktır.",
    value: "15"
  },
  {
    name: "Flood, Spam yapmak yasaktır.",
    value: "16"
  },
  {
    name: "Yetkilileri gereksiz yere etiketleyip rahatsız etmek yasaktır.",
    value: "17"
  },
  {
    name: "Eğlence kanallarında tek seferde çoklu mesaj atmak yasaktır.",
    value: "18"
  },
  {
    name: "Abone Galeri kanalında yanlış fotoğraf olsa bile silmek yasaktır.",
    value: "19"
  },
  {
    name: "Gereksiz yere destek açmak yasaktır.",
    value: "20"
  },
  {
    name: "Gereksiz mesajlar atmak yasaktır.",
    value: "21"
  },
  {
    name: "Bir kişiye yönelik mesajlar atmak yasaktır.",
    value: "22"
  },
  {
    name: "Toxiclik yapmak yasaktır.",
    value: "23"
  },
  {
    name: "Profil Fotoğrafına +18 Fotoğraf bulundurulması yasaktır.",
    value: "24"
  }
];

const times = [
  {
    name: "15 Minute",
    value: "15m"
  },
  {
    name: "30 Minute",
    value: "30m"
  },
  {
    name: "45 Minute",
    value: "45m"
  },
  {
    name: "1 Hour",
    value: "1h"
  },
  {
    name: "2 Hour",
    value: "2h"
  },
  {
    name: "3 Hour",
    value: "3h"
  },
  {
    name: "4 Hour",
    value: "4h"
  },
  {
    name: "5 Hour",
    value: "5h"
  },
  {
    name: "1 Day",
    value: "1d"
  },
  {
    name: "2 Day",
    value: "2d"
  },
  {
    name: "3 Day",
    value: "3d"
  },
  {
    name: "4 Day",
    value: "4d"
  },
  {
    name: "5 Day",
    value: "5d"
  },
  {
    name: "1 Week",
    value: "1w"
  },
  {
    name: "2 Week",
    value: "2w"
  },
  {
    name: "3 Week",
    value: "3w"
  },
  {
    name: "4 Week",
    value: "4w"
  },
  {
    name: "5 Week",
    value: "5w"
  },
  {
    name: "1 Year",
    value: "1y"
  },
  {
    name: "2 Year",
    value: "2y"
  },
  {
    name: "3 Year",
    value: "3y"
  },
  {
    name: "4 Year",
    value: "4y"
  },
  {
    name: "5 Year",
    value: "5y"
  },
  {
    name: "100 Year",
    value: "100y"
  }
];

export default class extends SlashCommand {  
  constructor() {
    super({ enabled: false, mode: "Global" });

    this.setCommand(new this.SlashCommand()
      .setName("punishment")
      .setDescription("Manage punishments for guild.")
      .addSubcommand((c) =>
        c.setName("add")
          .setDescription("Add punishment to user.")
          .addUserOption((o) => o.setName("member").setDescription("Select member for apply to punishment.").setRequired(true))
          .addStringOption((o) => o.setName("rule").setDescription("Select rule.").addChoices(...rules).setRequired(true))
          .addStringOption((o) => o.setName("time").setDescription("Select punishment time.").addChoices(...times))
      )
    );

    // THIS COMMAND NOT COMPLETED, DON'T TOUCH!!!
    // THIS COMMAND NOT COMPLETED, DON'T TOUCH!!!
    // THIS COMMAND NOT COMPLETED, DON'T TOUCH!!!
    // THIS COMMAND NOT COMPLETED, DON'T TOUCH!!!
    // THIS COMMAND NOT COMPLETED, DON'T TOUCH!!!
  };

  async execute({ interaction, member: m, channel: c, guild: g, options, command }) {
    const db = this.databases.general;

    if (command === "add") {
      const ruleNo = Number(options.getString("rule"));
      const time = options.getString("time");
    }
  };
};