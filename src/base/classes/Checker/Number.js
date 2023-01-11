import Checker from "./BaseChecker.js";

export class NumberChecker extends Checker {
  constructor(value = 0) {
    this.data = value;
  };

  /** 
  * Checks if the number is positive.
  * @returns {boolean|null}
  */
  get isPositive() {
    if (!this.isNumber || this.isUndefined || this.isNull) return null;

    if (this.data > (-1)) return true;
    else return false;
  };

  /** 
  * Checks if the number is negative.
  * @returns {boolean|null}
  */
  get isNegative() {
    if (!this.isNumber || this.isUndefined || this.isNull) return null;

    if (this.data < 0) return true;
    else return false;
  };
};