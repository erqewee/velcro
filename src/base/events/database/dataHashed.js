import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({ enabled: false, modes: ["Database"] });

          this.setName(this.Events.Database.DataHashed);

          this.execute = function (key, data, available, name) {
               return console.log(`[Database(${name})] Data hashed. \nKey: ${key} | Data: ${available ? data : "No data."}`);
          };
     };
};