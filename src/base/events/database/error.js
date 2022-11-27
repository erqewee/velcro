import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({
               enabled: true,
               process: false,
               database: true
          });

          this.setName(this.Events.Database.Error);
          
          this.setWebhook({ URL: process.env.WEBHOOKURL });
          
          this.execute = function (data) {
               console.log(data);
               return this.webhook.send({ content: `${data}` })
          };
     };
};