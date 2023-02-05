import { config } from "dotenv";
config({ override: true, encoding: "utf8" });

export default {
  Bot: {
    TOKEN: process.env[ "TOKEN" ],
    Developers: [ "744835491643260988" ]
  },

  WEBHOOK_URL: process.env[ "WEBHOOK" ],

  LANG: "en-US",

  Configurations: {
    VOICE_CHANNELS: [],
    SUPPORT_SERVER: "1068184874797764618",
    LOG_CHANNEL: "1068829043090280471",
    YOUTUBE_CHANNEL: "UCjtU9nHOAo6XpJCF9qb-1Ow"
  },

  Player: {
    Spotify: {
      ID: process.env[ "SPOTFIY_CLIENT_ID" ],
      SECRET: process.env[ "SPOTIFY_CLIENT_SECRET" ]
    }
  }
};