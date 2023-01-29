import { Event } from "../../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: false, modes: ["Database"] });

    this.setName(this.Events.Database.DataAdded);
  };

  async execute(key, value, oldData, newData, name) {
    return console.log(`[Database(${name})] Data added. \nKey: ${key} | Value: ${value} | (OLD) Data: ${oldData}, (NEW) Data: ${newData}`);
  };
};