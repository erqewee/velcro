import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({ enabled: false, modes: ["Database"] });

          this.setName(this.Events.Database.DataSubtracted);
                    
          this.execute = function (key, value, oldData, newData, name) {
               return console.log(`[Database(${name})] Data subtracted. \nKey: ${key} | Value: ${value} | (OLD) Data: ${oldData}, (NEW) Data: ${newData}`);
          };
     };
};