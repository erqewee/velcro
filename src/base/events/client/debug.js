import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({
               enabled: true,
               process: false
          });

          this.setName(this.Events.Discord.Debug);

          this.execute = function (data) {
               return this.setProperty({ key: "Webhook", value: { url: this.config.Data.WEBHOOKURL, message: { content: `${data}` } } });
          };
     };
};