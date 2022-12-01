import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({
               enabled: true,
               process: false,
               database: true
          });

          this.setName(this.Events.Database.Error);
                    
          this.execute = function (data) {
               return console.log(data);
          };
     };
};