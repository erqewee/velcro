import { Event } from "../../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: false, modes: ["Database"] });

    this.setName(this.Events.Database.DataFiltered);
  };

  async execute(data, callback, name) {
    return console.log(`[Database(${name})] Data filtered. \nData: ${data} | Callback: ${callback}`);
  };
};