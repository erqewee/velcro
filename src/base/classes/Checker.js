import { PermissionsBitField } from "discord.js";
const PermissionManager = new PermissionsBitField();

import { Data } from "../../config/export.js";

import { InvalidType, InvalidChannel, InvalidGuild, InvalidRole } from "../structures/base/error/Error.js";

const upperFirst = (str = "string!") => str.replace(/^\w/, (c) => c.toUpperCase());

export class Checker {
  constructor() { };

  error(argument, ftype = "InvalidType", options = { expected: "String", received: "Number" }) {
    const { expected, received } = options;

    if (!this.check(argument).isString()) throw new InvalidType("argument", { expected: "String", received: upperFirst(typeof argument) });
    if (!this.check(ftype).isString()) throw new InvalidType("type", { expected: "String", received: upperFirst(typeof ftype) });

    const type = ftype.toLowerCase();

    let data = new InvalidType(argument, { expected, received: upperFirst(received) });

    if (type === "invalidrole") data = new InvalidRole(argument);
    else if (type === "invalidchannel") data = new InvalidChannel(argument);
    else if (type === "invalidguild") data = new InvalidGuild(argument);
    else data = data;

    throw data;
  };

  check(dtc) {
    let data = dtc;

    return {
      isBoolean: function (cio) {
        if (cio) data = cio;

        const result = (typeof data === "boolean");

        return result;
      },

      isString: function (cio) {
        if (cio) data = cio;

        const result = (typeof data === "string");

        return result;
      },

      isObject: function (cio) {
        if (cio) data = cio;

        const result = (typeof data === "object");

        return result;
      },

      isSymbol: function (cio) {
        if (cio) data = cio;

        const result = (typeof data === "symbol");

        return result;
      },

      isArray: function (cio) {
        if (cio) data = cio;

        const result = (Array.isArray(data));

        return result;
      },

      isNumber: function (cio) {
        if (cio) data = cio;

        const result = (typeof data === "number");

        return result;
      },

      isFunction: function (cio) {
        if (cio) data = cio;

        const result = (typeof data === "function");

        return result;
      },

      isUndefined: function (cio) {
        if (cio) data = cio;

        const result = (typeof data === "undefined");

        return result;
      },

      isNull: function (cio) {
        if (cio) data = cio;

        const result = (data === null);

        return result;
      },

      isBigInt: function (cio) {
        if (cio) data = cio;

        const result = (typeof data === "bigint");

        return result;
      },

      isAvailable: function (cio) {
        if (cio) data = cio;

        let result = false;

        if (data) result = true;

        return result;
      },

      isPermission: function (cio) {
        if (cio) data = cio;

        let state = false;

        if (!this.isString(data)) throw new InvalidType("data", { expected: "String", received: (typeof data) });

        if (PermissionManager.has(data)) state = true;

        return state;
      },

      isOwner: function (cio) {
        if (cio) data = cio;

        let state = false;

        if (!this.isString(data)) throw new InvalidType("data", { expected: "String", received: (typeof data) });

        if (Data.Bot.Developers.includes(data)) state = true;

        return state;
      }
    };
  };
};
