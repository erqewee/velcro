import { JsonDatabase, YamlDatabase } from "wio.db";
import { unlinkSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import EventEmitter from "node:events";

import chalk from "chalk";

const Events = {
  DatabaseCreated: "databaseCreated",

  DatabaseDestroyRequest: "databaseDestroyRequest",
  DatabaseDestroyed: "databaseDestroyed",

  DataSaveRequest: "dataSaveRequest",
  DataSaved: "dataSaved",

  DataDeleteRequest: "dataDeleteRequest",
  DataDeleted: "dataDeleted",

  DataSubtractRequest: "dataSubtractRequest",
  DataSubtracted: "dataSubtracted",

  DataPushRequest: "dataPushRequest",
  DataPushed: "dataPushed",

  DataPullRequest: "dataPullRequest",
  DataPulled: "dataPulled",

  DataFetchRequest: "dataFetchRequest",
  DataFetched: "dataFetched",

  DataHasRequest: "dataHasRequest",
  DataHashed: "dataHashed",

  DataExistsRequest: "dataExistsRequest",
  DataExisted: "dataExisted",

  Error: "error"
};

export class Database extends EventEmitter {
  constructor(databaseOptions = { path: null, dir: null, name: "MyDatabase" }) {
    super();

    const { path, dir, name } = databaseOptions;

    this.path = path;
    this.dir = dir;
    this.name = name;

    this.Events = Events;

    const fullPath = `${this.path}/${this.dir}/${this.name}.json`;

    const dbName = this.name;

    let db = new JsonDatabase({ databasePath: fullPath.replaceAll("/", "\\") });
    this.database = db;

    this.set = function (key, value) {
      this.emit(this.Events.DataSaveRequest, key, value);

      this.database.set(key, value);
      const data = this.fetch(key);

      this.emit(this.Events.DataSaved, key, value, data);

      return { data, del: this.del };
    };

    this.del = function (key) {
      this.emit(this.Events.DataDeleteRequest, key);

      const data = this.fetch(key);
      this.database.delete(key);

      this.emit(this.Events.DataDeleted, key, data);

      return { data, set: this.set };
    };

    this.add = function (key, value) {
      this.emit(this.Events.DataSaveRequest, key, value);

      const oldData = this.fetch(key);
      this.database.add(key, value);
      const newData = this.fetch(key);

      this.emit(this.Events.DataSaved, key, value, oldData, newData);

      return { oldData, newData, sub: this.sub };
    };

    this.sub = function (key, value) {
      this.emit(this.Events.DataSubtractRequest, key, value);

      const oldData = this.fetch(key);
      this.database.substr(key, value);
      const newData = this.fetch(key);

      this.emit(this.Events.DataSubtracted, key, value, oldData, newData);

      return { oldData, newData, add: this.add };
    };

    this.push = function (key, value) {
      this.emit(this.Events.DataPushRequest, key, value);

      const oldData = this.fetch(key);
      this.database.push(key, value);
      const newData = this.fetch(key);

      this.emit(this.Events.DataPushed, key, value, oldData, newData);

      return { oldData, newData, pull: this.pull };
    };

    this.pull = function (key, callback) {
      this.emit(this.Events.DataPullRequest, key, callback);

      const oldData = this.fetch(key);
      this.database.pull(key, callback);
      const newData = this.fetch(key);

      this.emit(this.Events.DataPulled, key, callback, oldData, newData);

      return { oldData, newData, push: this.push };
    };

    this.fetch = function (key, fetchAllOptions = { enabled: false, limit: 3 }) {
      const { limit, enabled } = fetchAllOptions;

      if (key && enabled) console.log(chalk.bgYellowBright(" WARN "), chalk.grey(`You cannot use 'fetchAll' with a key. Please replace '${key}' with 'null' or disable 'fetchAll' mode.`));

      this.emit(this.Events.DataFetchRequest, key);

      const fetch = enabled ? this.database.fetchAll(limit) : this.database.fetch(key);

      this.emit(this.Events.DataFetched, key, fetch);

      return fetch;
    };

    this.has = function (key) {
      this.emit(this.Events.DataHasRequest, key);

      const has = this.database.has(key);
      const data = this.exists(key) ? this.fetch(key) : null;

      this.emit(this.Events.DataHashed, key, data);

      return has;
    };

    this.exists = function (key) {
      this.emit(this.Events.DataExistsRequest, key);

      const exist = this.database.exists(key);
      const data = exist ? this.fetch(key) : null;

      this.emit(this.Events.DataExisted, key, data);

      return exist;
    };

    this.create = function () {
      if (existsSync(resolve(path))) return;

      console.log(chalk.bgYellowBright(chalk.black(" WARN ")), chalk.grey(`Database#create function has been deprecated. Please use Database constructor instead.`));

      try {
        db = new JsonDatabase({ databasePath: String(path).replaceAll("/", "\\") });

        this.emit(Events.DatabaseCreated, chalk.cyanBright(`[Database] ${dbName} Created.`));
      } catch (err) {
        this.emit(this.Events.Error, chalk.redBright(`[DatabaseError] An error ocurred when creating "${dbName}", ${err}`));
      };
    };

    this.destroy = function () {
      this.emit(this.Events.DatabaseDestroyRequest, name);

      try {
        this.database.destroy();

        this.emit(this.Events.DatabaseDestroyed, name);
      } catch (err) {
        this.emit(this.Events.Error, err);
      };
    };
  };

  static YAML = YamlDatabase;
  static JSON = JsonDatabase;

  static Events = Events;
};