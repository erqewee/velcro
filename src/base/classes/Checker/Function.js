export class FunctionChecker {
  constructor(checker, value) {
    this.data = value;

    this.checker = checker;
  };

  /**
   * Creates a new function.
   * @param {Function | PromiseLike<Function>} functionCallback 
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

    await functionCallback(...args).catch(() => code = 1);

    return code;
  };
};