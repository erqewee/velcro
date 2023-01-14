import {
  InvalidType,
  InvalidChannel, InvalidGuild, InvalidRole,
  NotFound, LanguageNotFound,
  NotRequestedFormat,
  DataLimitExceeded
} from "../../structures/base/error/Error.js";

const upperFirst = (str = "string!") => String(str).replace(/^\w/, (c) => c.toUpperCase());

export default class BaseChecker {
  /**
   * Creates new BaseChecker for Checkers.
   * @param {any} data
   */
  constructor(data) {
    this.data = data;
  };

  /**
   * Checks if data is Boolean.
   * @returns {boolean}
   */
  get isBoolean() {
    if (this.isNull || this.isUndefined) return false;

    if (typeof this.data == "boolean") return true;
    else return false;
  };

  /**
   * Checks if data is String.
   * @returns {boolean}
   */
  get isString() {
    if (this.isNull || this.isUndefined) return false;

    if (typeof this.data == "string") return true;
    else return false;
  };

  /**
   * Checks if data is Object.
   * @returns {boolean}
   */
  get isObject() {
    if (this.isNull || this.isUndefined) return false;

    if (typeof this.data == "object") return true;
    else return false;
  };

  /**
   * Checks if data is Symbol.
   * @returns {boolean}
   */
  get isSymbol() {
    if (this.isNull || this.isUndefined) return false;

    if (typeof this.data == "symbol") return true;
    else return false;
  };

  /**
   * Checks if data is Array.
   * @returns {boolean}
   */
  get isArray() {
    if (this.isNull || this.isUndefined) return false;

    if (Array.isArray(this.data)) return true;
    else return false;
  };

  /**
   * Checks if data is Number.
   * @returns {boolean}
   */
  get isNumber() {
    if (this.isNull || this.isUndefined) return false;

    if (typeof this.data == "number") return true;
    else return false;
  };

  /**
   * Checks if data is Function.
   * @returns {boolean}
   */
  get isFunction() {
    if (this.isNull || this.isUndefined) return false;

    if (typeof this.data == "function") return true;
    else return false;
  };

  /**
   * Checks if data is Undefined.
   * @returns {boolean}
   */
  get isUndefined() {
    if (typeof this.data == "undefined" || this.data == "undefined") return true;
    else return false;
  };

  /**
   * Checks if data is Null.
   * @returns {boolean}
   */
  get isNull() {
    if (this.data == null || this.data == "null") return true;
    else return false;
  };

  /**
   * Checks if data is BigInt.
   * @returns {boolean}
   */
  get isBigInt() {
    if (this.isNull || this.isUndefined) return false;

    if (typeof this.data == "bigint") return true;
    else return false;
  };

  /**
   * Checks if data is Available.
   * @returns {boolean}
   */
  get isAvailable() {
    if (this.isNull || this.isUndefined) return false;
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
   * Creates a new Error.
   * @param {boolean} condition 
   * @param {string} argument 
   * @param {{errorType?: string, expected?: string, received: string | null}}
   * @returns {{throw: () => void}}
   */
  createError(condition, argument, { errorType = "InvalidType", expected = "String", received }) {
    if (typeof argument !== "string") throw new InvalidType("argument", { expected: "String", received: upperFirst(typeof argument) });
    if (typeof errorType !== "string") throw new InvalidType("type", { expected: "String", received: upperFirst(typeof errorType) });

    const type = (errorType.replace(/ /g, "_")).toUpperCase();

    const fetched = upperFirst(received ?? this.toString());

    let error = new InvalidType(argument, { expected, received: fetched });

    if (type === "INVALID_ROLE") error = new InvalidRole(argument);
    else if (type === "INVALID_CHANNEL") error = new InvalidChannel(argument);
    else if (type === "INVALID_GUILD") error = new InvalidGuild(argument);
    else if (type === "NOT_FOUND") error = new NotFound(argument);
    else if (type === "NOT_REQUESTED_FORMAT") error = new NotRequestedFormat(argument, { expected, received: fetched });
    else if (type === "LANGUAGE_NOT_FOUND") error = new LanguageNotFound(argument, { locate: expected, path: fetched });
    else if (type === "DATA_LIMIT_EXCEEDED") error = new DataLimitExceeded(argument, expected, fetched);

    const isNotUndefined = this.isNotUndefined;
    const isNotNull = this.isNotNull;

    /**
     * Send the created error to the console.
     * @returns {void}
     */
    function throwError() {
      if (typeof condition !== "boolean") throw new InvalidType("condition", { expected: "Boolean", received: upperFirst(typeof condition) });

      if (condition && isNotUndefined && isNotNull) throw error;
    };

    return {
      throw: throwError
    };
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
    else if (this.isNull || this.isUndefined) type = undefined;
    else if (this.isNumber) type = "number";
    else if (this.isObject) type = "object";
    else if (this.isSymbol) type = "symbol";

    type = (upperFirstChar ? upperFirst(type) : type);

    return type;
  };
};