import { config } from "dotenv";
config({ override: true, encoding: "utf8" });

export default {
    Bot: {
        TOKEN: process.env.TOKEN,
        Developers: ["744835491643260988"]
    },

    WEBHOOKURL: process.env.WEBHOOK
};