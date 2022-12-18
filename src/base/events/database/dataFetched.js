import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({ enabled: true, modes: ["Database"] });

          this.setName(this.Events.Database.DataFetched);
                    
          this.execute = function (key, data, name) {
               return console.log(`[Database(${name})] Data fetched. \nKey: ${key} | Data: ${data}`);
          };
     };
};