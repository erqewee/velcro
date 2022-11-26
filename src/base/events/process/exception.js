import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({
               enabled: true,
               process: true
          });

          this.setName("uncaughtException");
          
          this.execute = function (data) {
               return console.log(data);
          };
     };
};