import Checker from "./BaseChecker.js";

export class FunctionChecker extends Checker {
  constructor(value) {
    this.data = value;
  };

  /**
   * Creates a new function.
   * @param {Function|PromiseLike<Function>} functionCallback 
   */
  newFunction(functionCallback) {
    let _function = function () { };

    if (functionCallback) _function = functionCallback;

    return _function;
  };

  /**
   * Execute the specified function. (Code 0: Successful | Code 1: Failed)
   * @param {PromiseLike<Function>} functionCallback 
   * @param {...any} args
   * @returns {number} 
   */
  async execute(functionCallback, ...args) {
    let code = 0;

    if (typeof functionCallback !== "function") return 1;

    await functionCallback(...args).then(() => code = 0).catch(() => code = 1);

    return code;
  };
};