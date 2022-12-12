import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({
               enabled: true,
               process: false
          });

          this.setName(this.Events.Discord.Warn);
          
          this.execute = function (data) {
               console.log(data);
               return this.setProperty({ key: "Webhook", value: { url: this.config.Data.WEBHOOKURL, message: { content: `${data}` } } });
          };
     };
};