import { Event } from "../../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: false, modes: ["Database"] });

    this.setName(this.Events.Database.DataPulled);
  };

  async execute(key, callback, oldData, newData, name) {
    return console.log(`[Database(${name})] Data pulled. \nKey: ${key} | (OLD) Data: ${oldData}, (NEW) Data: ${newData} | Callback: ${callback}`);
  };
};