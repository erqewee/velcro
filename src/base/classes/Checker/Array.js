export class ArrayChecker {
  constructor(checker, value = []) {
    this.data = value;

    this.checker = checker;
  };

  /**
   * Determines whether an array includes a certain element, returning true or false as appropriate.
   * @param {string} element The element to search for.
   * @param {number?} index The position in this array at which to begin searching for element.
   * @returns {boolean}
   */
  includes(element, index) {
    if (this.checker.isNotArray || this.checker.isUndefined || this.checker.isNull) return false;

    if (this.data.includes(element, index)) return true;
    else return false;
  };

  /**
   * Appends new elements to the end of an array, and returns the new length of the array.
   * @param  {...any} items 
   * @returns {Array}
   */
  push(...items) {
    const array = [];

    if (this.checker.isNotArray || this.checker.isUndefined || this.checker.isNull) return array;

    for (let index = 0; index < items.length; index++) array.push(items[index]);

    return array;
  };

  /**
   * Creates new array with items.
   * @param {any[]} items 
   * @returns {any[]}
   */
  newArray(...items) {
    const array = [];

    if (items.length > 0) for (let index = 0; index < items.length; index++) array.push(items[index]);

    return array;
  };

  /**
   * Transfer data from the specified array.
   * @param {any[]} array 
   * @returns {any[]} New array
   */
  transferArray(array) {
    const newArray = [];

    if (array.length > 0) for (let index = 0; index < array.length; index++) newArray.push(array[index]);

    return newArray;
  };

  /**
   * Converts array to readable object.
   * @returns {object | false}
   */
  toJSON() {
    let body = {};

    if (this.isNotArray || this.checker.isUndefined || this.checker.isNull) return false;

    for (let index = 0; index < this.data.length; index++) body[array[index]] = array[index];

    return body;
  };
};