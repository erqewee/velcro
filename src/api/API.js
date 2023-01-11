import got from "got";

import { Data } from "../config/export.js";

const headers = { Authorization: `Bot ${Data.Bot.TOKEN}` };
const config = { BASE_URL: "https://discord.com/api", VERSION: "v10" };

import { Checker } from "../base/classes/Checker/Checker.js";
const checker = new Checker();

export class API {
  constructor() { };

  checker = checker;

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
  async GET(url, options = { json: {} }) {
    const urlChecker = new checker.BaseChecker(url);
    urlChecker.createError(!urlChecker.isString, "url", { expected: "String" }).throw();

    const { json } = options;

    if (!json) json = {};

    let response;

    response = await got(url, { headers }).json();

    return response;
  };

  /**
   * Assigns a PATCH request to the specified URL.
   * @param {string} url 
   * @param {{json: {}}} options 
   * @returns {Promise<any>}
   */
  async PATCH(url, options = { json: {} }) {
    const urlChecker = new checker.BaseChecker(url);
    urlChecker.createError(!urlChecker.isString, "url", { expected: "String" }).throw();

    const { json } = options;

    if (!json) json = {};

    let response;

    response = await got(url, { method: "PATCH", headers }).json();

    return response;
  };

  /**
   * Assigns a PUT request to the specified URL.
   * @param {string} url 
   * @param {{json: {}}} options 
   * @returns {any}
   */
  async PUT(url, options = { json: {} }) {
    const urlChecker = new checker.BaseChecker(url);
    urlChecker.createError(!urlChecker.isString, "url", { expected: "String" }).throw();

    const { json } = options;

    if (!json) json = {};

    let response;

    response = await got(url, { method: "PUT", headers }).json();

    return response;
  };

  /**
   * Assigns a DELETE request to the specified URL.
   * @param {string} url 
   * @returns {void}
   */
  DELETE(url) {
    const urlChecker = new checker.BaseChecker(url);
    urlChecker.createError(!urlChecker.isString, "url", { expected: "String" }).throw();

    (async () => await got(url, { method: "DELETE", headers }))();
  };

  /**
   * Assigns a POST request to the specified URL.
   * @param {string} url 
   * @param {{json: {}}} options 
   * @returns {Promise<any>}
   */
  async POST(url, options = { json: {} }) {
    const urlChecker = new checker.BaseChecker(url);
    urlChecker.createError(!urlChecker.isString, "url", { expected: "String" }).throw();

    const { json } = options;

    if (!json) json = {};

    let response;

    response = await got(url, { method: "POST", headers }).json();

    return response;
  };

  static GOT = got;
};