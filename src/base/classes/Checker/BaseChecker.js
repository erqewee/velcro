import { ErrorBuilder } from "../../structures/base/error/ErrorBuilder.js";

import { StringChecker } from "./String.js";
import { BooleanChecker } from "./Boolean.js";
import { SymbolChecker } from "./Symbol.js";
import { ArrayChecker } from "./Array.js";
import { FunctionChecker } from "./Function.js";
import { ObjectChecker } from "./Object.js";
import { NumberChecker } from "./Number.js";

const upperFirst = (str = "string!") => String(str).replace(/^\w/, (c) => c.toUpperCase());

import { s } from "@sapphire/shapeshift";
import { isNumber, isFunction } from "@sapphire/utilities";
import lodash from "lodash";
const { isArray, isSymbol, isObject } = lodash;

export default class BaseChecker {
  /**
   * Creates new BaseChecker for Checkers.
   * @param {any} data
   */
  constructor(data) {
    this.data = data;

    this.string = new StringChecker(this, data);
    this.boolean = new BooleanChecker(this, data);
    this.symbol = new SymbolChecker(this, data);
    this.array = new ArrayChecker(this, data);
    this.function = new FunctionChecker(this, data);
    this.object = new ObjectChecker(this, data);
    this.number = new NumberChecker(this, data);
  };

  /**
   * Checks if data is Boolean.
   * @returns {boolean}
   */
  get isBoolean() {
    if (this.isNull) return false;

    if (s.boolean.is(this.data)) return true;
    else return false;
  };

  /**
   * Checks if data is String.
   * @returns {boolean}
   */
  get isString() {
    if (this.isNull) return false;

    if (s.string.is(this.data)) return true;
    else return false;
  };

  /**
   * Checks if data is Object.
   * @returns {boolean}
   */
  get isObject() {
    if (this.isNull) return false;

    if (isObject(this.data)) return true;
    else return false;
  };

  /**
   * Checks if data is Symbol.
   * @returns {boolean}
   */
  get isSymbol() {
    if (this.isNull) return false;

    if (isSymbol(this.data)) return true;
    else return false;
  };

  /**
   * Checks if data is Array.
   * @returns {boolean}
   */
  get isArray() {
    if (this.isNull) return false;

    if (isArray(this.data)) return true;
    else return false;
  };

  /**
   * Checks if data is Number.
   * @returns {boolean}
   */
  get isNumber() {
    if (this.isNull) return false;

    if (isNumber(this.data)) return true;
    else return false;
  };

  /**
   * Checks if data is Function.
   * @returns {boolean}
   */
  get isFunction() {
    if (this.isNull) return false;

    if (isFunction(this.data)) return true;
    else return false;
  };

  /**
   * Checks if data is Undefined.
   * @returns {boolean}
   */
  get isUndefined() {
    if (this.data == "undefined" || this.data == undefined) return true;
    else return false;
  };

  /**
   * Checks if data is Null.
   * @returns {boolean}
   */
  get isNull() {
    if (this.data == "null" || this.data == null) return true;
    else return false;
  };

  /**
   * Checks if data is BigInt.
   * @returns {boolean}
   */
  get isBigInt() {
    if (this.isNull) return false;

    if (s.bigint.is(this.data)) return true;
    else return false;
  };

  /**
   * Checks if data is Available.
   * @returns {boolean}
   */
  get isAvailable() {
    if (this.isNull) return false;
    else return true;
  };

  /**
   * Checks that the data is not Boolean.
   * @returns {boolean}
   */
  get isNotBoolean() {
    if (this.isBoolean) return false;
    else return true;
  };

  /**
   * Checks that the data is not String.
   * @returns {boolean}
   */
  get isNotString() {
    if (this.isString) return false;
    else return true;
  };

  /**
   * Checks that the data is not Object.
   * @returns {boolean}
   */
  get isNotObject() {
    if (this.isObject) return false;
    else return true;
  };

  /**
   * Checks that the data is not Symbol.
   * @returns {boolean}
   */
  get isNotSymbol() {
    if (this.isSymbol) return false;
    else return true;
  };

  /**
   * Checks that the data is not Array.
   * @returns {boolean}
   */
  get isNotArray() {
    if (this.isArray) return false;
    else return true;
  };

  /**
   * Checks that the data is not Number.
   * @returns {boolean}
   */
  get isNotNumber() {
    if (this.isNumber) return false;
    else return true;
  };

  /**
   * Checks that the data is not Function.
   * @returns {boolean}
   */
  get isNotFunction() {
    if (this.isFunction) return false;
    else return true;
  };

  /**
   * Checks that the data is not Undefined.
   * @returns {boolean}
   */
  get isNotUndefined() {
    if (this.isUndefined) return false;
    else return true;
  };

  /**
   * Checks that the data is not Null.
   * @returns {boolean}
   */
  get isNotNull() {
    if (this.isNull) return false;
    else return true;
  };

  /**
   * Checks that the data is not BigInt.
   * @returns {boolean}
   */
  get isNotBigInt() {
    if (this.isBigInt) return false;
    else return true;
  };

  /**
   * Checks that the data is not Available.
   * @returns {boolean}
   */
  get isNotAvailable() {
    if (this.isAvailable) return false;
    else return true;
  };

  /**
   * Default type of the "this.data" value.
   * @param {boolean} upperFirstChar
   * @returns {string}
   */
  toString(upperFirstChar = true) {
    let type = "string";

    if (this.isArray) type = "array";
    else if (this.isBigInt) type = "bigint";
    else if (this.isBoolean) type = "boolean";
    else if (this.isFunction) type = "function";
    else if (this.isNull) type = null;
    else if (this.isNumber) type = "number";
    else if (this.isObject) type = "object";
    else if (this.isSymbol) type = "symbol";

    return (upperFirstChar ? upperFirst(type) : type);
  };

  Error = new ErrorBuilder(this);
};