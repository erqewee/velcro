import { fork } from "node:child_process";

import { API } from "./api/API.js";
const api = new API();

import Emoji from "./config/Emoji.js";

const bot = fork("./src/index.js");
function spawn(process) {
  let ready = false;

  process.on("spawn", () => ready = true);

  process.on("message", (payload, handle) => {
    const json = JSON.parse(JSON.stringify(payload));

    if (json.request === 0) {
      const message = json[ "message" ];
      const channel = json[ "channel" ];

      if (!ready) return;

      api.PATCH(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channel}/messages/${message}`, {
        json: {
          content: `${Emoji.State.SUCCESS} Rebooted.`
        }
      });
    };
  });

  process.on("error", (err) => console.log(`Error: ${err}`));
  process.on("exit", (code, signal) => {
    console.log(`Error[${code}]: ${signal}`);
    spawn(fork("./src/index.js"));
  });
};

spawn(bot);