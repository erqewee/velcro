import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({
               enabled: true,
               process: false
          });

          this.setWebhook({ URL: this.config.Data.WEBHOOKURL });

          this.setName(this.Events.Discord.Warn);
          
          this.execute = function (data) {
               console.log(data);
               return this.webhook.send({ content: `${data}` })
          };
     };
};