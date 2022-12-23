import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({ enabled: false, modes: ["Database"] });

          this.setName(this.Events.Database.DataFetched);
                    
          this.execute = function (key, data, available, name) {
               return console.log(`[Database(${name})] Data fetched. \nKey: ${key} | Data: ${available ? data : "No data."}`);
          };
     };
};