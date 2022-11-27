import { Event } from "../../structures/export.js";

export default class extends Event {
    constructor() {
        super({
            enabled: false,
            process: false,
            type: "Button"
        });

        this.setName(this.Events.Discord.InteractionCreate);

        this.execute = function (interaction) {};
    };
};