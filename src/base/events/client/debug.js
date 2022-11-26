import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({
               enabled: true,
               process: false
          });

          this.setWebhook({ URL: this.config.Data.WEBHOOKURL });

          this.setName(this.events.Debug);

          this.execute = function (data) {
               return this.webhook.send({ content: `${data}` })
          };
     };
};