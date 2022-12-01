import got from "got";

import { Data } from "../config/export.js";

const headers = { Authorization: `Bot ${Data.Bot.TOKEN}` };
const config = { BASE_URL: "https://discord.com/api", VERSION: "v10" };

export class API {
  constructor() {
    this.GET = async function (url, options = { json: {} }) {
      const { json } = options;

      if (!json) json = {};
      
      return await got(url, { method: "GET", headers }).json();
    };

    this.PATCH = async function (url, options = { json: {} }) {
      const { json } = options;

      if (!json) json = {};

      return await got(url, { method: "PATCH", headers, json }).json();
    };

    this.PUT = async function (url, options = { json: {} }) {
      const { json } = options;

      if (!json) json = {};

      return await got(url, { method: "PUT", headers, json }).json();
    };

    this.DELETE = async function (url) {
      return await got(url, { method: "DELETE", headers }).json();
    };

    this.POST = async function (url, options = { json: {} }) {
      const { json } = options;

      if (!json) json = {};

      return await got(url, { method: "POST", json, headers }).json();
    };

    this.config = config;
    this.headers = {
      default: headers,
      custom: {}
    };
  };

  static GOT = got;
};