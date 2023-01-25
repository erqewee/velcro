import { config } from "dotenv";
config({ override: true, encoding: "utf8" });

export default {
    Bot: {
        TOKEN: process.env.TOKEN,
        Developers: ["744835491643260988"]
    },

    WEBHOOK_URL: process.env.WEBHOOK,

    LANG: "en-US"
};