import { fork } from "node:child_process";
import { lookup } from "node:dns";

import { API } from "./api/API.js";
const api = new API();

import Emoji from "./config/Emoji.js";

spawn(fork("./src/index.js"));
function spawn(child) {
  checkConnection((connection) => {
    if (!connection) process.exit(1);
    
    child.on("message", (payload, handle) => {
      const json = JSON.parse(JSON.stringify(payload));

      if (json.request === 0) {
        const message = json[ "message" ];
        const channel = json[ "channel" ];

        api.PATCH(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channel}/messages/${message}`, {
          json: {
            content: `${Emoji.State.SUCCESS} Rebooted.`
          }
        });
      };
    });

    child.on("exit", (code, signal) => {
      console.log(`Error[${code}]: ${signal}`);
      spawn(fork("./src/index.js"));
    });
  });

  child.on("error", (err) => console.log(`Error: ${err}`));
};

function checkConnection(callback) {
  lookup("discord.com", (err, address, family) => {
    if (err?.code === "ENOTFOUND") return callback(false);
    else return callback(true);
  });
};