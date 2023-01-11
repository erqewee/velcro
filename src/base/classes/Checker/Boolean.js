import Checker from "./BaseChecker.js";

export class BooleanChecker extends Checker {
  constructor(value) {
    this.data = value;
  };

  /**
   * Check if "value" value is false
   * @returns {boolean}
   */
  get isFalse() {
    if (!this.isBoolean) return false;

    if (this.data == false) return true;
    else return false;
  };

  /**
   * Check if "value" value is true
   * @returns {boolean}
   */
  get isTrue() {
    if (!this.isBoolean) return false;

    if (this.data == true) return true;
    else return false;
  };
};