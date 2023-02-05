import EventEmitter from "node:events";
import chalk from "chalk";

import { JsonDatabase, YamlDatabase } from "wio.db";

import { readFile, writeFileSync } from "node:fs";

import { Events } from "./Events.js";

import { get } from "stack-trace";

import { Checker as BaseChecker } from "../Checker/Checker.js";
const Checker = BaseChecker.BaseChecker;

export class Database extends EventEmitter {
  constructor(type = "JSON", databaseOptions = { path: "../../", dir: "databases", name: "MyDatabase", debug: false }) {
    super();

    const { path, dir, name, debug } = databaseOptions;

    const typeError = new Checker(type).Error;
    typeError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'type'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const pathError = new Checker(path).Error;
    pathError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'path'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const dirError = new Checker(dir).Error;
    dirError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'dir'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const nameError = new Checker(name).Error;
    nameError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'name'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const debugError = new Checker(debug).Error;
    debugError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'debug'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    this.path = path;
    this.dir = dir;
    this.name = name.split(".json")[ 0 ];

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
    const keyError = new Checker(key).Error;
    keyError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'key'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    this.emit(this.Events.DataSaveRequest, key, value, this.name);

    this.database.set(key, value);
    const data = this.fetch(key);

    this.emit(this.Events.DataSaved, key, value, data, this.name);

    const stack = get()[ 1 ];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "set", this.name);

    return { data, del: this.del };
  };

  del(key = "ErqeweeDevelopment", deleteAllOptions = { enabled: false }) {
    const keyError = new Checker(key).Error;
    keyError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'key'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const { enabled } = deleteAllOptions;

    this.emit(this.Events.DataDeleteRequest, key, this.name);

    const data = this.fetch(key);
    enabled ? this.database.deleteAll() : this.database.delete(key);

    this.emit(this.Events.DataDeleted, key, data, this.name);

    const stack = get()[ 1 ];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "del", this.name);

    return { data, set: this.set };
  };

  add(key = "ErqeweeDevelopment.Projects.COUNT", value = 1) {
    const keyError = new Checker(key).Error;
    keyError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'key'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const valueError = new Checker(value).Error;
    valueError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'value'.")
      .setCondition("isNotNumber")
      .setType("InvalidType")
      .throw();

    this.emit(this.Events.DataAddRequest, key, value, this.name);

    const oldData = this.fetch(key);
    this.database.add(key, value);
    const newData = this.fetch(key);

    this.emit(this.Events.DataAdded, key, value, oldData, newData, this.name);

    const stack = get()[ 1 ];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "add", this.name);

    return { oldData, newData, sub: this.sub };
  };

  sub(key = "ErqeweeDevelopment.Projects.COUNT", value = 1) {
    const keyError = new Checker(key).Error;
    keyError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'key'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const valueError = new Checker(value).Error;
    valueError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'value'.")
      .setCondition("isNotNumber")
      .setType("InvalidType")
      .throw();

    this.emit(this.Events.DataSubtractRequest, key, value, this.name);

    const oldData = this.fetch(key);
    this.database.substr(key, value);
    const newData = this.fetch(key);

    this.emit(this.Events.DataSubtracted, key, value, oldData, newData, this.name);

    const stack = get()[ 1 ];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "sub", this.name);

    return { oldData, newData, add: this.add };
  };

  push(key = "ErqeweeDevelopment.Projects.Active", value = "Wyvern") {
    this.emit(this.Events.DataPushRequest, key, value, this.name);

    const oldData = this.fetch(key);
    this.database.push(key, value);
    const newData = this.fetch(key);

    this.emit(this.Events.DataPushed, key, value, oldData, newData, this.name);

    const stack = get()[ 1 ];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "push", this.name);

    return { oldData, newData, pull: this.pull };
  };

  pull(key = "ErqeweeDevelopment.Projects.Active", callback = (data) => data === "Wyvern") {
    const keyError = new Checker(key).Error;
    keyError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'key'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const callbackError = new Checker(callback).Error;
    callbackError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'callback'.")
      .setCondition("isNotFunction")
      .setType("InvalidType")
      .throw();

    this.emit(this.Events.DataPullRequest, key, callback, this.name);

    const oldData = this.fetch(key);
    this.database.pull(key, callback);
    const newData = this.fetch(key);

    this.emit(this.Events.DataPulled, key, callback, oldData, newData, this.name);

    const stack = get()[ 1 ];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "pull", this.name);

    return { oldData, newData, push: this.push };
  };

  fetch(key = "ErqeweeDevelopment", fetchAllOptions = { enabled: false, limit: 3 }) {
    const keyError = new Checker(key).Error;
    keyError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'key'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const { limit, enabled } = fetchAllOptions;

    this.emit(this.Events.DataFetchRequest, key, this.name);

    let available = false;

    if (key && enabled) console.log(chalk.bgYellowBright(" WARN "), chalk.grey(`You cannot use 'fetchAll' with a key. Please replace '${key}' with 'null' or disable 'fetchAll' mode.`));

    const fetch = enabled ? this.database.fetchAll(limit) : this.database.fetch(key);

    if (fetch) available = true;

    this.emit(this.Events.DataFetched, key, fetch, available, this.name);

    const stack = get()[ 1 ];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "fetch", this.name);

    return fetch;
  };

  has(key = "ErqeweeDevelopment") {
    const keyError = new Checker(key).Error;
    keyError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'key'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    this.emit(this.Events.DataCheckRequest, key, this.name);

    let available = false;

    const has = this.database.has(key);
    const data = has ? this.fetch(key) : null;

    if (has) available = true;

    this.emit(this.Events.DataChecked, key, data, available, this.name);

    const stack = get()[ 1 ];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "has", this.name);

    return has;
  };

  exists = this.has;

  filter(callback = (value, index = 0, array = []) => { }) {
    const callbackError = new Checker(callback).Error;
    callbackError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'callback'.")
      .setCondition("isNotFunction")
      .setType("InvalidType")
      .throw();

    this.emit(this.Events.DataFilterRequest, callback, this.name);

    const filter = this.database.filter(callback);

    this.emit(this.Events.DataFiltered, filter, callback, this.name);

    const stack = get()[ 1 ];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "filter", this.name);

    return filter;
  };

  sort(callback = (a, b) => { }) {
    const callbackError = new Checker(callback).Error;
    callbackError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'callback'.")
      .setCondition("isNotFunction")
      .setType("InvalidType")
      .throw();

    this.emit(this.Events.DataSortRequest, callback, this.name);

    const sort = this.database.sort(callback);

    this.emit(this.Events.DataSorted, sort, callback, this.name);

    const stack = get()[ 1 ];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "sort", this.name);

    return sort;
  };

  toJSON(limit) {
    const limitError = new Checker(limit).Error;
    limitError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'limit'.")
      .setCondition("isNotNumber")
      .setType("InvalidType")
      .throw();

    const json = this.database.toJSON(limit);

    const stack = get()[ 1 ];
    const path = stack.getFileName();
    const line = stack.getLineNumber();
    const column = stack.getColumnNumber();

    if (this.debug) this.emit(this.Events.Debug, path, line, column, "toJSON", this.name);

    return json;
  };

  backup(path) {
    const pathError = new Checker(path).Error;
    pathError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'path'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const fullPath = this.database.path;

    readFile(fullPath, (err, value) => {
      if (err) throw err;

      let data = JSON.parse(value);

      return writeFileSync(path, `${data}`, { flag: "a+" });
    });

    this.emit(this.Events.DatabaseBackedUp, path);
  };

  destroy() {
    this.emit(this.Events.DatabaseDestroyRequest, this.name);

    const stack = get()[ 1 ];
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