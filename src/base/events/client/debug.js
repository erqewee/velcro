import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({ enabled: true });

          this.setName(this.Events.Discord.Debug);

          this.execute = function (data) {
               return this.createWebhook({ url: this.config.Data.WEBHOOKURL }).send({ content: `${data}` });
          };
     };
};