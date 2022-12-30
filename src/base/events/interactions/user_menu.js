import { Event } from "../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: false, type: "UserMenu" });

    this.setName(this.Events.Discord.InteractionCreate);
  };

  async execute(interaction) {

  };
};