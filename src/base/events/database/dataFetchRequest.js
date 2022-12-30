import { Event } from "../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: false, modes: ["Database"] });

    this.setName(this.Events.Database.DataFetchRequest);
  };

  async execute(key, name) {
    return console.log(`[Database(${name})] Data fetch request. \nKey: ${key}`);
  };
};