import got from "got";

import { Data } from "../config/export.js";

const headers = { Authorization: `Bot ${Data.Bot.TOKEN}` };
const config = { BASE_URL: "https://discord.com/api", VERSION: "v10" };

export class Manager {
  static GOT = got;
  static config = config;
  static headers = headers;

  static async GET(url) {
    return await got(url, { method: "GET", headers }).json();
  };

  static async PATCH(url, json) {
    return await got(url, { method: "PATCH", json, headers }).json();
  };

  static async PUT(url, json) {
    return await got(url, { method: "PUT", json, headers }).json();
  };

  static async DELETE(url) {
    return await got(url, { method: "DELETE", headers }).json();
  };

  static async POST(url, json) {
    return await got(url, { method: "POST", json, headers }).json();
  };
};