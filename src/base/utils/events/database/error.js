import { Event } from "../../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: true, modes: ["Database"] });

    this.setName(this.Events.Database.Error);
  };

  async execute(data) {
    return console.log(`[Database] An error ocurred. \n${data}`);
  };
};