import got from "got";

import { Data } from "../config/export.js";

const headers = { Authorization: `Bot ${Data.Bot.TOKEN}` };
const config = { BASE_URL: "https://discord.com/api", VERSION: "v10" };

import { Checker } from "../base/classes/Checker.js";
const checker = new Checker();

export class API {
  constructor() { };

  checker = checker;

  config = config;
  headers = {
    default: headers,
    custom: {}
  };

  async GET(url, options = { json: {} }) {
    if (!checker.check(url).isString()) checker.error("url", "InvalidType", { expected: "String", received: (typeof url) });
    if (!checker.check(options).isObject()) checker.error("options", "InvalidType", { expected: "Object", received: (typeof options) });

    if (!checker.check(options?.json).isObject()) checker.error("options#json", "InvalidType", { expected: "Object", received: (typeof options?.json) });

    const { json } = options;

    if (!json) json = {};

    const response = await got(url, { method: "GET", headers }).json();

    return response;
  };

  async PATCH(url, options = { json: {} }) {
    if (!checker.check(url).isString()) checker.error("url", "InvalidType", { expected: "String", received: (typeof url) });
    if (!checker.check(options).isObject()) checker.error("options", "InvalidType", { expected: "Object", received: (typeof options) });

    if (!checker.check(options?.json).isObject()) checker.error("options#json", "InvalidType", { expected: "Object", received: (typeof options?.json) });

    const { json } = options;

    if (!json) json = {};

    const response = await got(url, { method: "PATCH", headers, json }).json();

    return response;
  };

  async PUT(url, options = { json: {} }) {
    if (!checker.check(url).isString()) checker.error("url", "InvalidType", { expected: "String", received: (typeof url) });
    if (!checker.check(options).isObject()) checker.error("options", "InvalidType", { expected: "Object", received: (typeof options) });

    if (!checker.check(options?.json).isObject()) checker.error("options#json", "InvalidType", { expected: "Object", received: (typeof options?.json) });

    const { json } = options;

    if (!json) json = {};

    const response = await got(url, { method: "PUT", headers, json }).json();

    return response;
  };

  DELETE(url) {
    if (!checker.check(url).isString()) checker.error("url", "InvalidType", { expected: "String", received: (typeof url) });

    (async () => await got(url, { method: "DELETE", headers }))();

    return 0;
  };

  async POST(url, options = { json: {} }) {
    if (!checker.check(url).isString()) checker.error("url", "InvalidType", { expected: "String", received: (typeof url) });
    if (!checker.check(options).isObject()) checker.error("options", "InvalidType", { expected: "Object", received: (typeof options) });

    if (!checker.check(options?.json).isObject()) checker.error("options#json", "InvalidType", { expected: "Object", received: (typeof options?.json) });

    const { json } = options;

    if (!json) json = {};

    const response = await got(url, { method: "POST", json, headers }).json();

    return response;
  };

  static GOT = got;
};