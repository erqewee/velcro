import { Event } from "../../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: false, modes: ["Database"] });

    this.setName(this.Events.Database.DataAddRequest);
  };

 async execute(key, value, name) {
    return console.log(`[Database(${name})] Data add request. \nKey: ${key} | Value: ${value}`);
  };
};