import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({ enabled: false, modes: ["Database"] });

          this.setName(this.Events.Database.DataSaved);
                    
          this.execute = function (key, value, name) {
               return console.log(`[Database(${name})] Data save request. \nKey: ${key} | Value: ${value}`);
          };
     };
};