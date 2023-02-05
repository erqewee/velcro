import { PermissionsBitField } from "discord.js";
const PermissionManager = new PermissionsBitField();

import { Data } from "../../../config/export.js";

import BaseChecker from "./BaseChecker.js";


export class Checker {
  /**
   * Creates a new default checker.
   */
  static BaseChecker = BaseChecker;

  /**
   * Creates a new default checker.
   */
  BaseChecker = BaseChecker;

  constructor() { };

  /**
   * Checks if the specified argument has a Discord permission.
   * @param {string | bigint | number} data 
   * @returns {boolean}
   */
  isPermission(data) {
    const dataError = new BaseChecker(data).Error
    dataError.setName("ValidationError")
    .setMessage("An invalid type was specified for 'data'.")
    .setCondition("isNotString", "isNotBigInt", "isNotNumber")
    .setType("InvalidType")
    .throw();

    if (PermissionManager.has(data)) return true;
    else return false;
  };

  /**
   * Checks if the specified User ID has a this Bot Owner/Developer.
   * @param {string} data 
   * @returns {boolean}
   */
  isOwner(data) {
    let state = false;

    const dataError = new BaseChecker(data).Error
    dataError.setName("ValidationError")
    .setMessage("An invalid type was specified for 'data'.")
    .setCondition("isNotString")
    .setType("InvalidType")
    .throw();

    if (Data.Bot.Developers.includes(data)) state = true;

    return state;
  };
};