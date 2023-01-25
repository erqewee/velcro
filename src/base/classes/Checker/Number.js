export class NumberChecker {
  constructor(checker, value = 0) {
    this.data = value;

    this.checker = checker;
  };

  /** 
  * Checks if the number is positive.
  * @returns {boolean|null}
  */
  get isPositive() {
    if (this.checker.isNotNumber || this.checker.isUndefined || this.checker.isNull) return null;

    if (this.data >= 0) return true;
    else return false;
  };

  /** 
  * Checks if the number is negative.
  * @returns {boolean|null}
  */
  get isNegative() {
    if (this.checker.isNotNumber || this.checker.isUndefined || this.checker.isNull) return null;

    if (this.data < 0) return true;
    else return false;
  };
};