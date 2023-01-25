export class BooleanChecker {
  constructor(checker, value) {
    this.data = value;

    this.checker = checker;
  };

  /**
   * Check if "value" value is false
   * @returns {boolean}
   */
  get isFalse() {
    if (this.checker.isNotBoolean) return false;

    if (this.data == false || this.data == "false") return true;
    else return false;
  };

  /**
   * Check if "value" value is true
   * @returns {boolean}
   */
  get isTrue() {
    if (this.checker.isNotBoolean) return false;

    if (this.data == true || this.data == "true") return true;
    else return false;
  };
};