import { Event } from "../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: false, modes: ["Database"] });

    this.setName(this.Events.Database.DataDeleteRequest);
  };

  async execute(key, name) {
    return console.log(`[Database(${name})] Data delete request. \nKey: ${key}`);
  };
};