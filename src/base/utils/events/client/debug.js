import { Event } from "../../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: true });

    this.setName(this.Events.Discord.Debug);
  };

  execute(data) {
    return this.createWebhook({ url: this.config.Data.WEBHOOK_URL }).send({ content: `${data}` });
  };
};