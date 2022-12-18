import { Event } from "../../structures/export.js";

export default class extends Event {
    constructor() {
        super({ enabled: false, type: "StringMenu" });

        this.setName(this.Events.Discord.InteractionCreate);

        this.execute = function (interaction) {

        };
    };
};