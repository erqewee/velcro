import { fetch, FetchResultTypes as Types, FetchMethods as Methods } from "@sapphire/fetch";

import { Data } from "../config/export.js";

const headers = { Authorization: `Bot ${Data.Bot.TOKEN}`, "Content-Type": "application/json" };
const config = { BASE_URL: "https://discord.com/api", VERSION: "v10" };

import { Checker as Default } from "../base/classes/Checker/Checker.js";
const Checker = new Default().BaseChecker;
export class API {
  constructor() { };

  checker = new Default();

  config = config;
  headers = {
    default: headers,
    custom: {}
  };

  /**
   * Assigns a GET request to the specified URL.
   * @param {string} url 
   * @param {{json: {}}} options 
   */
  async GET(url) {
    const urlError = new Checker(url).Error;
    urlError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'url'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    return (await fetch(url, { method: Methods.Get, headers }, Types.JSON));
  };

  /**
   * Assigns a PATCH request to the specified URL.
   * @param {string} url 
   * @param {{json: {}}} options 
   * @returns {Promise<any>}
   */
  async PATCH(url, options = { json: {} }) {
    const urlError = new Checker(url).Error;
    urlError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'url'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const { json } = options;

    if (!json) json = {};

    return (await fetch(url, { method: Methods.Patch, headers, body: json }, Types.JSON));
  };

  /**
   * Assigns a PUT request to the specified URL.
   * @param {string} url 
   * @param {{json: {}}} options 
   * @returns {any}
   */
  async PUT(url, options = { json: {} }) {
    const urlError = new Checker(url).Error;
    urlError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'url'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const { json } = options;

    if (!json) json = {};

    return (await fetch(url, { method: Methods.Put, headers, body: json }, Types.JSON));
  };

  /**
   * Assigns a DELETE request to the specified URL.
   * @param {string} url 
   * @returns {void}
   */
  DELETE(url) {
    const urlError = new Checker(url).Error;
    urlError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'url'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    (async () => await fetch(url, { method: Methods.Delete, headers}))();

    return void 0;
  };

  /**
   * Assigns a POST request to the specified URL.
   * @param {string} url 
   * @param {{json: {}}} options 
   * @returns {Promise<any>}
   */
  async POST(url, options = { json: {} }) {
    const urlError = new Checker(url).Error;
    urlError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'url'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const { json } = options;

    if (!json) json = {};

    return (await fetch(url, { method: Methods.Post, headers, body: json  }, Types.JSON));
  };
};