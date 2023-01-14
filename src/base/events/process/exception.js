import { Event } from "../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: false, modes: ["Process"] });

    this.setName("uncaughtException");
  };

  async execute(data) {
    return console.log(data);
  };
};