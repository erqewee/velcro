import { SlashCommand } from "../../../structures/export.js";

export default class extends SlashCommand {
  constructor() {
    super({ enabled: true, mode: "Global" });

    this.setCommand(new this.SlashCommand()
      .setName("economy")
      .setDescription("Economy system.")
      .addSubcommand((c) => c.setName("work").setDescription("You work at a job."))
      .addSubcommand((c) => c.setName("exchange").setDescription("View exchange status."))
    );
  };

  async execute({ interaction, member, guild, options, command: c }) {
    const db = this.databases.economy;
    const market = this.market;

    if (c === "work") {
      const exchange = {
        exchange: db.fetch("Exchange.Exchange"),
        OldExchange: db.fetch("Exchange.OldExchange"),
        Difference: db.fetch("Exchange.Difference")
      };


    } else if (c === "exchange") {
      await interaction.deferReply();

      const embed = new this.Embed({
        title: `${this.client.user.username} - Economy | Exchange`
      });

      const fields = [];
      for (let index = 0; index < market.stocks.length; index++) {
        const stock = market.stocks[ index ];
        const info = market.cache.fetch(stock.currency);

        let emote = info.State.Emote;
        if (db.fetch(`Exchange.Data_${stock.currency}.State.Last`)?.length < 4) {
          let upCount = 0;
          let downCount = 0;

          for (let i = 0; i < db.fetch(`Exchange.Data_${stock.currency}.State.Last`)?.length; i++) {
            const em = db.fetch(`Exchange.Data_${stock.currency}.State.Last`)[ i ];

            if (em === "UP") upCount++;
            else downCount++;
          };

          if (upCount > 1) emote = this.config.Emoji.Status.UP;
          if (downCount > 1) emote = this.config.Emoji.Status.DOWN;
        };

        fields.push({
          name: `> Currency ${stock.currency}`,
          value: `\n\`Price:\` **${info.Prices.NEW.toFixed(2)}** \n\n\`State:\` ${info.State.Difference} ${emote}`,

          p: Number(info.Prices.NEW.toFixed(2))
        });
      };
      embed.addFields(fields.sort((a, b) => b.p - a.p));

      return interaction.editReply({ embeds: [ embed ] });
    };
  };
};