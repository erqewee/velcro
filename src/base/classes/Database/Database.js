import EventEmitter from "node:events";
import chalk from "chalk";

import { JsonDatabase, YamlDatabase } from "wio.db";

import { Events } from "./Events.js";

import { get } from "stack-trace";

import { Checker as BaseChecker } from "../Checker/Checker.js";
const Checker = BaseChecker.BaseChecker;

export class Database extends EventEmitter {
  constructor(type = "JSON", databaseOptions = { path: "../../", dir: "databases", name: "MyDatabase", debug: false }) {
    super();

    const { path, dir, name, debug } = databaseOptions;

    const typeChecker = new Checker(type);
    typeChecker.createError(!typeChecker.isString, "type", { expected: "String", received: typeChecker }).throw();

    const pathChecker = new Checker(path);
    pathChecker.createError(!pathChecker.isString, "path", { expected: "String", received: pathChecker }).throw();

    const dirChecker = new Checker(dir);
    dirChecker.createError(!dirChecker.isString, "dir", { expected: "String", received: dirChecker }).throw();

    const nameChecker = new Checker(name);
    nameChecker.createError(!nameChecker.isString, "name", { expected: "String", received: nameChecker }).throw();

    const debugChecker = new Checker(debug);
    debugChecker.createError(!debugChecker.isBoolean, "debug", { expected: "Boolean", received: debugChecker }).throw();

    this.path = path;
    this.dir = dir;
    this.name = name.split(".json")[0];

    this.debug = debug;

    const fullPath = `${this.path}/${this.dir}/${this.name}.json`;
    const databasePath = String(fullPath).replaceAll("/", "\\");

    this.database = new JsonDatabase({ databasePath });
    if (type.toLowerCase() === "yaml") this.database = new YamlDatabase({ databasePath });

    this.setMaxListeners(0);
  };

  debug = false;

  Events = Events;

  set(key = "ErqeweeDevelopment.Discord", value = "https://discord.gg/ZwhgJvXqm9") {
    const keyChecker = new Checker(key);
    keyChecker.createError(!keyChecker.isString, "key", { expected: "String", received: keyChecker }).throw();

    this.emit(this.Events.DataSaveRequest, key, value, this.name);

    this.database.set(key, value);
    const data = this.fetch(key);

    this.emit(this.Events.DataSaved, key, value, data, this.name);

    const stack = get()[1];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "set", this.name);

    return { data, del: this.del };
  };

  del(key = "ErqeweeDevelopment", deleteAllOptions = { enabled: false }) {
    const keyChecker = new Checker(key);
    keyChecker.createError(!keyChecker.isString, "key", { expected: "String", received: keyChecker }).throw();

    const { enabled } = deleteAllOptions;

    this.emit(this.Events.DataDeleteRequest, key, this.name);

    const data = this.fetch(key);
    enabled ? this.database.deleteAll() : this.database.delete(key);

    this.emit(this.Events.DataDeleted, key, data, this.name);

    const stack = get()[1];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "del", this.name);

    return { data, set: this.set };
  };

  add(key = "ErqeweeDevelopment.Projects.COUNT", value = 1) {
    const keyChecker = new Checker(key);
    keyChecker.createError(!keyChecker.isString, "key", { expected: "String", received: keyChecker }).throw();

    const valueChecker = new Checker(value);
    valueChecker.createError(!valueChecker.isBoolean, "value", { expected: "Number", received: valueChecker }).throw();

    this.emit(this.Events.DataAddRequest, key, value, this.name);

    const oldData = this.fetch(key);
    this.database.add(key, value);
    const newData = this.fetch(key);

    this.emit(this.Events.DataAdded, key, value, oldData, newData, this.name);

    const stack = get()[1];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "add", this.name);

    return { oldData, newData, sub: this.sub };
  };

  sub(key = "ErqeweeDevelopment.Projects.COUNT", value = 1) {
    const keyChecker = new Checker(key);
    keyChecker.createError(!keyChecker.isString, "key", { expected: "String", received: keyChecker }).throw();

    const valueChecker = new Checker(value);
    valueChecker.createError(!valueChecker.isBoolean, "value", { expected: "Number", received: valueChecker }).throw();

    this.emit(this.Events.DataSubtractRequest, key, value, this.name);

    const oldData = this.fetch(key);
    this.database.substr(key, value);
    const newData = this.fetch(key);

    this.emit(this.Events.DataSubtracted, key, value, oldData, newData, this.name);

    const stack = get()[1];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "sub", this.name);

    return { oldData, newData, add: this.add };
  };

  push(key = "ErqeweeDevelopment.Projects.Active", value = "Wyvern") {
    const keyChecker = new Checker(key);
    keyChecker.createError(!keyChecker.isString, "key", { expected: "String", received: keyChecker }).throw();

    this.emit(this.Events.DataPushRequest, key, value, this.name);

    const oldData = this.fetch(key);
    this.database.push(key, value);
    const newData = this.fetch(key);

    this.emit(this.Events.DataPushed, key, value, oldData, newData, this.name);

    const stack = get()[1];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "push", this.name);

    return { oldData, newData, pull: this.pull };
  };

  pull(key = "ErqeweeDevelopment.Projects.Active", callback = (data) => data === "Wyvern") {
    const keyChecker = new Checker(key);
    keyChecker.createError(!keyChecker.isString, "key", { expected: "String", received: keyChecker }).throw();

    const callbackChecker = new Checker(callback);
    callbackChecker.createError(!callbackChecker.isFunction, "callback", { expected: "Function", received: callbackChecker }).throw();

    this.emit(this.Events.DataPullRequest, key, callback, this.name);

    const oldData = this.fetch(key);
    this.database.pull(key, callback);
    const newData = this.fetch(key);

    this.emit(this.Events.DataPulled, key, callback, oldData, newData, this.name);

    const stack = get()[1];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "pull", this.name);

    return { oldData, newData, push: this.push };
  };

  fetch(key = "ErqeweeDevelopment", fetchAllOptions = { enabled: false, limit: 3 }) {
    const keyChecker = new Checker(key);
    keyChecker.createError(!keyChecker.isString, "key", { expected: "String", received: keyChecker }).throw();

    const { limit, enabled } = fetchAllOptions;

    this.emit(this.Events.DataFetchRequest, key, this.name);

    let available = false;

    if (key && enabled) console.log(chalk.bgYellowBright(" WARN "), chalk.grey(`You cannot use 'fetchAll' with a key. Please replace '${key}' with 'null' or disable 'fetchAll' mode.`));

    const fetch = enabled ? this.database.fetchAll(limit) : this.database.fetch(key);

    if (fetch) available = true;

    this.emit(this.Events.DataFetched, key, fetch, available, this.name);

    const stack = get()[1];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "fetch", this.name);

    return fetch;
  };

  has(key = "ErqeweeDevelopment") {
    const keyChecker = new Checker(key);
    keyChecker.createError(!keyChecker.isString, "key", { expected: "String", received: keyChecker }).throw();

    this.emit(this.Events.DataHasRequest, key, this.name);

    let available = false;

    const has = this.database.has(key);
    const data = has ? this.fetch(key) : null;

    if (has) available = true;

    this.emit(this.Events.DataHashed, key, data, available, this.name);

    const stack = get()[1];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "has", this.name);

    return has;
  };

  exists(key = "ErqeweeDevelopment") {
    const keyChecker = new Checker(key);
    keyChecker.createError(!keyChecker.isString, "key", { expected: "String", received: keyChecker }).throw();

    this.emit(this.Events.DataExistsRequest, key, this.name);

    let available = false;

    const exist = this.database.exists(key);
    const data = exist ? this.fetch(key) : null;

    if (exist) available = true;

    this.emit(this.Events.DataExisted, key, data, available, this.name);

    const stack = get()[1];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "exists", this.name);

    return exist;
  };

  filter(callback = (value, index = 0, array = []) => { }) {
    const callbackChecker = new Checker(callback);
    callbackChecker.createError(!callbackChecker.isFunction, "callback", { expected: "Function", received: callbackChecker }).throw();

    this.emit(this.Events.DataFilterRequest, callback, this.name);

    const filter = this.database.filter(callback);

    this.emit(this.Events.DataFiltered, filter, callback, this.name);

    const stack = get()[1];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "filter", this.name);

    return filter;
  };

  sort(callback = (a, b) => { }) {
    const callbackChecker = new Checker(callback);
    callbackChecker.createError(!callbackChecker.isFunction, "callback", { expected: "Function", received: callbackChecker }).throw();

    this.emit(this.Events.DataSortRequest, callback, this.name);

    const sort = this.database.sort(callback);

    this.emit(this.Events.DataSorted, sort, callback, this.name);

    const stack = get()[1];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "sort", this.name);

    return sort;
  };

  toJSON(limit) {
    const limitChecker = new Checker(limit);
    limitChecker.createError(!limitChecker.isNumber, "limit", { expected: "Number", received: limitChecker }).throw();

    const json = this.database.toJSON(limit);

    const stack = get()[1];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "toJSON", this.name);

    return json;
  };

  destroy() {
    this.emit(this.Events.DatabaseDestroyRequest, this.name);

    const stack = get()[1];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "destroy", this.name);

    try {
      this.database.destroy();

      this.emit(this.Events.DatabaseDestroyed, this.name);
    } catch (err) {
      this.emit(this.Events.Error, err);
    };
  };

  static YAML = "YAML";
  static JSON = "JSON";

  static YAMLDatabase = YamlDatabase;
  static JSONDatabase = JsonDatabase;

  static Events = Events;
};