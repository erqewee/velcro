import { Event } from "../../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: false, modes: ["Database"] });

    this.setName(this.Events.Database.DataDeleted);
  };

  async execute(key, data, name) {
    return console.log(`[Database(${name})] Data deleted. \nKey: ${key} | Data: ${data}`);
  };
};