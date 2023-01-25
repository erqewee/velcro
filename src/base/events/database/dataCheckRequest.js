import { Event } from "../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: false, modes: ["Database"] });

    this.setName(this.Events.Database.DataCheckRequest);
  };

  async execute(key, name) {
    return console.log(`[Database(${name})] Data check request. \nKey: ${key}`);
  };
};