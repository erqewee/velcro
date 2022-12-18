import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({ enabled: false, modes: ["Database"] });

          this.setName(this.Events.Database.DataSaveRequest);
                    
          this.execute = function (key, value, data, name) {
               return console.log(`[Database(${name})] Data saved. \nKey: ${key} | Value: ${value} | Data: ${data}`);
          };
     };
};