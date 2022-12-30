import { Event } from "../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: false, modes: ["Database"] });

    this.setName(this.Events.Database.DataFilterRequest);
  };

  async execute(callback, name) {
    return console.log(`[Database(${name})] Data filter request. \nCallback: ${callback}`);
  };
};