import AsciiTable from "ascii-table";
const table = new AsciiTable("Borsa Durumu");
table.setHeading("Case", "Currency", "New Price", "Eski Ücret", "Durum", "Fark");

import { MarketsCache } from "./Cache.js";

import Emoji from "../../../config/Emoji.js";

export class Market {
  constructor(db) {
    this.db = db;
  };

  cache = MarketsCache;

  stocks = [
    { currency: "$", price: 5 },
    { currency: "€", price: 5 },
    { currency: "₺", price: 5 }
  ];

  comparePrices(newPrice, oldPrice) {
    let output = { emote: 0, difference: 0 };

    if (newPrice < oldPrice) {
      output = {
        emote: Emoji.Status.DOWN,
        difference: `-${(oldPrice - newPrice).toFixed(2).replace("-", "")}`
      };
    } else {
      output = {
        emote: Emoji.Status.UP,
        difference: `+${(newPrice - oldPrice).toFixed(2)}`
      };
    };

    return output;
  };

  updatePrices() {    
    let i = 0;

    for (let index = 0; index < this.stocks.length; index++) {
      const stock = this.stocks[ index ];
      this.db.del(`Exchange.Data_${stock.currency}.State.Last`);

      setInterval(() => {
        const operation = [ "INCREASE", "DECREASE" ][ Math.floor(Math.random() * 2) ];

        i++;

        if (operation === "INCREASE") {
          let increaseCount = Number((Math.random() * 2).toFixed(2));
          let oldPrice = Number(stock.price.toFixed(2));
          stock.price += increaseCount;
          if (stock.price < 0) stock.price = 0;
          let newPrice = Number(stock.price.toFixed(2));

          const changes = this.comparePrices(newPrice, oldPrice);

          this.db.set(`Exchange.Data_${stock.currency}.Prices.OLD`, oldPrice);
          this.db.set(`Exchange.Data_${stock.currency}.Prices.NEW`, newPrice);
          this.db.set(`Exchange.Data_${stock.currency}.Increased`, increaseCount);
          this.db.set(`Exchange.Data_${stock.currency}.State.Emote`, changes.emote);
          this.db.set(`Exchange.Data_${stock.currency}.State.Difference`, changes.difference);

          if (this.db.fetch(`Exchange.Data_${stock.currency}.State.Last`)?.length > 2) this.db.del(`Exchange.Data_${stock.currency}.State.Last`);

          this.db.push(`Exchange.Data_${stock.currency}.State.Last`, "UP");

          this.cache.set(stock.currency, {
            Prices: { OLD: oldPrice, NEW: newPrice },
            Increased: increaseCount,
            Decreased: 0,
            State: { Emote: changes.emote, Difference: changes.difference }
          });
          // table.addRow("Increase", stock.currency, newPrice.toFixed(2), oldPrice.toFixed(2), changes.emote, changes.difference);
        } else {
          let decreaseCount = Number((Math.random() * 2).toFixed(2));
          let oldPrice = Number(stock.price.toFixed(2));
          stock.price -= decreaseCount;
          if (stock.price < 0) stock.price = 0;
          let newPrice = Number(stock.price.toFixed(2));

          const changes = this.comparePrices(newPrice, oldPrice);

          this.db.set(`Exchange.Data_${stock.currency}.Prices.OLD`, oldPrice);
          this.db.set(`Exchange.Data_${stock.currency}.Prices.NEW`, newPrice);
          this.db.set(`Exchange.Data_${stock.currency}.Decreased`, decreaseCount);
          this.db.set(`Exchange.Data_${stock.currency}.State.Emote`, changes.emote);
          this.db.set(`Exchange.Data_${stock.currency}.State.Difference`, changes.difference);

          if (this.db.fetch(`Exchange.Data_${stock.currency}.State.Last`)?.length > 2) this.db.del(`Exchange.Data_${stock.currency}.State.Last`);

          this.db.push(`Exchange.Data_${stock.currency}.State.Last`, "DOWN");

          this.cache.set(stock.currency, {
            Prices: { OLD: oldPrice, NEW: newPrice },
            Increased: 0,
            Decreased: decreaseCount,
            State: { Emote: changes.emote, Difference: changes.difference }
          });
          // table.addRow("Decrease", stock.currency, newPrice.toFixed(2), oldPrice.toFixed(2), changes.emote, changes.difference);
        };

        if (i === 3) {
          // console.log(table.toString());
          // table.clearRows();
          i = 0;
        };
      }, 5000);
    };
  };
};