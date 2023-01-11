import BaseChecker from "../Checker/BaseChecker.js";

import EventEmitter from "node:events";

import { StorageEvents as Events } from "./Events.js";

const percent = (a, b) => ((a / b) * 100).toFixed(2);

export class Storage extends EventEmitter {
  /**
   * @constructor
   * @param {number} storageSize Storage size. 
   * @default 128000
   */
  constructor(storageSize = 128000) {
    super();

    this.setMaxListeners(0);

    const storageSizeChecker = new BaseChecker(storageSize);
    storageSizeChecker.createError(!storageSizeChecker.isNumber, "storageSize", { expected: "Number" }).throw();

    this.storageSize = Number(storageSize).toFixed();
  };

  static Events = Events;

  #STORAGE = new Map();

  /**
   * Shows Total Size of Storage.
   * @returns {number}
   */
  size = 0;

  /**
   * Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.
   * @param {string} key 
   * @param {any} value 
   * @returns {any}
   */
  set(key, value) {
    const keyChecker = new BaseChecker(key);
    keyChecker.createError(!keyChecker.isString, "key", { expected: "String" }).throw();

    new BaseChecker(this.size).createError(this.size > this.storageSize, "storage", { errorType: "Data Limit Exceeded", expected: this.size, received: this.storageSize }).throw();

    this.#STORAGE.set(key, value);

    const data = this.fetch(key);

    this.emit(Events.DataSaved, key, value, data);

    this.size++;

    return data;
  };

  /**
   * 
   * @param {string} key 
   * @returns {boolean} true if an element in the Map existed and has been removed, or false if the element does not exist.
   */
  delete(key) {
    const keyChecker = new BaseChecker(key);
    keyChecker.createError(!keyChecker.isString, "key", { expected: "String" }).throw();

    const data = this.fetch(key);
    this.#STORAGE.delete(key);

    this.emit(Events.DataDeleted, key, data);

    this.size--;

    return data;
  };

  /**
   * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
   * @param {string} key
   * @returns {any | undefined} Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
   */
  fetch(key) {
    const keyChecker = new BaseChecker(key);
    keyChecker.createError(!keyChecker.isString, "key", { expected: "String" }).throw();

    const data = this.#STORAGE.get(key);

    this.emit(Events.DataFetched, key, data);

    return data;
  };

  /**
   * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
   * @param {string} key
   * @returns {any | undefined} Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
   */
  get = this.fetch;

  /**
   * @param {string} key 
   * @returns {boolean} Boolean indicating whether an element with the specified key exists or not.
   */
  exists(key) {
    const keyChecker = new BaseChecker(key);
    keyChecker.createError(!keyChecker.isString, "key", { expected: "String" }).throw();

    const has = this.#STORAGE.has(key);

    let data = null;
    if (has) data = this.fetch(key);

    this.emit(Events.DataChecked, key, has, data);

    return has;
  };

  /**
   * @param {string} key 
   * @returns {boolean} Boolean indicating whether an element with the specified key exists or not.
   */
  has = this.exists;

  /**
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   * @param {( value: any, key: string, index: number, this: Storage )} callback — A function that accepts up to four arguments. The map method calls the callback function one time for each element in the array.
   * @returns {void[]}
   */
  map(callback) {
    const callbackChecker = new BaseChecker(callback);
    callbackChecker.createError(!callbackChecker.isFunction, "callback", { expected: "Function" }).throw();

    let index = 0;

    const entries = this.entries();

    this.emit(Events.DataMapped, callback);

    return Array.from({ length: this.size }, () => {
      const [key, value] = entries.next().value;

      callback(value, key, index, this);

      index++;
    });
  };

  /**
   * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
   * @param {( value: any, key: string, this: Storage )} callback
   * find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
   * @returns {boolean | undefined}
   */
  find(callback) {
    const callbackChecker = new BaseChecker(callback);
    callbackChecker.createError(!callbackChecker.isFunction, "callback", { expected: "Function" }).throw();

    for (const [key, value] of this.#STORAGE) {
      if (callback(value, key, this)) return true;
    };

    return void 0;
  };

  /**
   * Reverses the elements in an array in place. This method mutates the array and returns a reference to the same array.
   * @returns {this}
   */
  reverse() {
    const entries = [...this.entries()].reverse();

    this.clear();

    for (const [key, value] of entries) {
      this.set(key, value);

      this.size++;
    };

    return this;
  };

  /**
   * Clears storage.
   * @returns {string[]}
   */
  clear() {
    this.size = 0;

    const keys = this.keys();

    for (let index = 0; index <= keys.length; index++) this.delete(keys[index]);

    return keys;
  };

  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param {( value: any, key: string, index: number, this: Storage )} callback A function that accepts up to four arguments. The filter method calls the callback function one time for each element in the array.
   */
  filter(callback) {
    const callbackChecker = new BaseChecker(callback);
    callbackChecker.createError(!callbackChecker.isFunction, "callback", { expected: "Function" }).throw();

    const results = new this.#STORAGE.constructor[Symbol.species]();

    let index = -1;

    for (const [key, value] of this.#STORAGE) {
      if (callback(value, key, index, this)) results.set(key, value);
      index++;
    };

    return results;
  };

  /**
   * 
   * @param {string} key 
   */
  type(key) {
    const keyChecker = new BaseChecker(key);
    keyChecker.createError(!keyChecker.isString, "key", { expected: "String" }).throw();

    const value = this.fetch(key);

    return (typeof value);
  };

  /** 
   * Returns an iterable of key, value pairs for every entry in the map.
   */
  entries() {
    return this.#STORAGE.entries();
  };

  keys() {
    const keysArray = this.toJSON().keys;

    return keysArray;
  };

  values() {
    const valuesArray = this.toJSON().values;

    return valuesArray;
  };

  toJSON() {
    const keys = this.#STORAGE.keys();
    const values = this.#STORAGE.values();

    return { keys: [...keys], values: [...values] };
  };

  information() {
    const stats = this.#fetchStats();

    return stats;
  };

  #fetchStats() {
    const usedStorage = Number(this.size);
    const totalSize = Number(this.storageSize);

    const usedStoragePercentage = percent(usedStorage, totalSize);
    const totalSizePercentage = percent(totalSize, usedStorage);

    const usedStorageUnits = this.#convertSizeUnits(usedStorage);
    const usedStorageKiloByte = `${usedStorageUnits.KILOBYTE}KB`;
    const usedStorageMegaByte = `${usedStorageUnits.MEGABYTE}MB`;
    const usedStorageGigaByte = `${usedStorageUnits.GIGABYTE}GB`;
    const usedStorageTeraByte = `${usedStorageUnits.TERABYTE}TB`;

    const totalSizeUnits = this.#convertSizeUnits(totalSize);
    const totalSizeKiloByte = `${totalSizeUnits.KILOBYTE}KB`;
    const totalSizeMegaByte = `${totalSizeUnits.MEGABYTE}MB`;
    const totalSizeGigaByte = `${totalSizeUnits.GIGABYTE}GB`;
    const totalSizeTeraByte = `${totalSizeUnits.TERABYTE}TB`;

    const usedStorageOutput = `[Storage] ½${usedStoragePercentage} storage space was used. (${usedStorageKiloByte} | ${usedStorageMegaByte} | ${usedStorageGigaByte} | ${usedStorageTeraByte}) `;
    const totalSizeOutput = `[Storage(ExperimentalFeature)] ½${totalSizePercentage} data covers in storage. (${totalSizeKiloByte} | ${totalSizeMegaByte} | ${totalSizeGigaByte} | ${totalSizeTeraByte}) `;

    return { usedStorage: usedStorageOutput, totalSize: totalSizeOutput };
  };

  #convertSizeUnits(bytes) {
    const KILOBYTE = (bytes * 1024);
    const MEGABYTE = (KILOBYTE / 1024);
    const GIGABYTE = (MEGABYTE / 1024);
    const TERABYTE = (GIGABYTE / 1024);

    return { KILOBYTE: KILOBYTE.toFixed(1), MEGABYTE: MEGABYTE.toFixed(1), GIGABYTE: GIGABYTE.toFixed(1), TERABYTE: TERABYTE.toFixed(1) };
  };
};