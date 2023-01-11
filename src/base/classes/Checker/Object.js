import Checker from "./BaseChecker.js";

export class ObjectChecker extends Checker {
  constructor(value) {
    this.data = value;
  };

  /**
   * Determines whether an object has a property with the specified name.
   * @param {object} object 
   * @param {string} name 
   * @returns {boolean}
   */
  hasProperty(object = {}, name) {
    const obj = new Object(object);

    if (obj.hasOwnProperty(name)) return true;
    else return false;
  };
};