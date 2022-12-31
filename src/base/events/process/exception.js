import { Event } from "../../structures/export.js";

import ora from "ora";

let spinner = ora("The \"Uncaught Exception\" event is being tracked.").start();

export default class extends Event {
  constructor() {
    super({ enabled: false, modes: ["Process"] });

    this.setName("uncaughtException");
  };

  async execute(data) {
    spinner.warn(` The event "Uncaught Exception" has been received. | ${data}`);

    spinner = spinner.render().start("The \"Uncaught Exception\" event is being tracked.");
  };
};