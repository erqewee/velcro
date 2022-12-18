import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({ enabled: false, modes: ["Database"] });

          this.setName(this.Events.Database.DataPullRequest);
                    
          this.execute = function (key, callback, name) {
               return console.log(`[Database(${name})] Data pull request. \nKey: ${key} | Callback: ${callback}`);
          };
     };
};