export class StringChecker {
  constructor(checker, value) {
    this.data = value;

    this.checker = checker;
  };

  /**
   * Returns true if search appears as a substring of the result of converting this object to a String, at one or more positions that are greater than or equal to position; otherwise, returns false.
   * @param {any} search search string
   * @param {number} position If position is undefined, 0 is assumed, so as to search all of the String.
   */
  includes(search, position) {
    const input = String(search);

    if (String(this.data).includes(input, position)) return true;
    else return false;
  };
};