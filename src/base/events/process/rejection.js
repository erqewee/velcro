import { Event } from "../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: true, modes: ["Process"] });

    this.setName("uncaughtRejection");
  };

  async execute(data) {
    return console.log(data);
  };
};