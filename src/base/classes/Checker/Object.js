export class ObjectChecker {
  constructor(checker, value) {
    this.data = value;

    this.checker = checker;
  };

  /**
   * Determines whether an object has a property with the specified name.
   * @param {string} name 
   * @returns {boolean}
   */
  has(name) {
    if (this.checker.isNotObject) return false;

    const obj = new Object(JSON.parse(JSON.stringify(this.data)));

    if (obj.hasOwnProperty(name)) return true;
    else return false;
  };
};