import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({ enabled: false, modes: ["Database"] });

          this.setName(this.Events.Database.Error);
                    
          this.execute = function (data) {
               return console.log(`[Database] An error ocurred. \n${data}`);
          };
     };
};