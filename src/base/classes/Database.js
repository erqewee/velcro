import { JsonDatabase, YamlDatabase } from "wio.db";
import { unlinkSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import EventEmitter from "node:events";

import chalk from "chalk";

const Events = {
  DatabaseCreated: "databaseCreated",
  DatabaseDeleted: "databaseDeleted",

  DataSaveRequest: "dataSaveRequest",
  DataSaved: "dataSaved",

  DataDeleteRequest: "dataDeleteRequest",
  DataDeleted: "dataDeleted",

  DataSubstrackRequest: "dataSubstrackRequest",
  DataSubstracked: "dataSubstracked",

  DataPushRequest: "dataPushRequest",
  DataPushed: "dataPushed",

  DataPullRequest: "dataPullRequest",
  DataPulled: "dataPulled",

  DataFetchRequest: "dataFetchRequest",
  DataFetched: "dataFetched",

  DataGetRequest: "dataGetRequest", // This is removing fully in Wyvern's future versions.
  DataGetted: "dataGetted", // This is removing fully in Wyvern's future versions.

  DataHasRequest: "dataHasRequest",
  DataHased: "dataHased",

  Error: "error"
};

export class Database extends EventEmitter {
  constructor(path) {
    super();

    this.Events = Events;

    const splitPath = String(path).replaceAll("/", "\\").split("\\");
    const dbName = String(splitPath[splitPath.length - 1]).replaceAll(".json", "");

    let db = new JsonDatabase({ databasePath: String(path).replaceAll("/", "\\") });
    this.db = db;

    this.set = function (key, value) {
      this.emit(this.Events.DataSaveRequest, key, value);

      const set = this.db.set(key, value);

      const data = this.get(key);

      this.emit(this.Events.DataSaved, key, value, data);

      return set;
    };

    this.del = function (key) {
      this.emit(this.Events.DataDeleteRequest, key);

      const del = this.db.delete(key);

      this.emit(this.Events.DataDeleted, key);

      return del;
    };

    this.add = function (key, value) {
      this.emit(this.Events.DataSaveRequest, key, value);

      const add = this.db.add(key, value);

      const data = this.get(key);

      this.emit(this.Events.DataSaved, key, value, data);

      return add;
    };

    this.sub = function (key, value) {
      this.emit(this.Events.DataSubstrackRequest, key, value);

      const sub = this.db.substr(key, value);

      const data = this.get(key);

      this.emit(this.Events.DataSubstracked, key, value, data);

      return sub;
    };

    this.push = function (key, value) {
      this.emit(this.Events.DataPushRequest, key, value);

      const push = this.db.push(key, value);

      const data = this.get(key);

      this.emit(this.Events.DataPushed, key, value, data);

      return push;
    };

    this.pull = function (key, callback) {
      this.emit(this.Events.DataPullRequest, key, callback);

      const oldData = this.get(key);

      const pull = this.db.pull(key, callback);

      const newData = this.get(key);

      this.emit(this.Events.DataPulled, key, callback, oldData, newData);

      return pull;
    };

    this.fetch = function (key) {
      this.emit(this.Events.DataFetchRequest, key);

      const fetch = this.db.fetch(key);

      this.emit(this.Events.DataFetched, key);

      return fetch;
    };

    this.get = function (key) {
      console.log(chalk.bgYellowBright(chalk.black(" WARN ")), chalk.bold(`Database#get function has been deprecated. Please use Database#fetch instead.`));

      this.emit(this.Events.DataGetRequest, key);

      const get = this.db.get(key);

      this.emit(this.Events.DataGetted, key);

      return get;
    };

    this.has = function (key) {
      this.emit(this.Events.DataHasRequest, key);

      const has = this.db.has(key);

      this.emit(this.Events.DataHased, key);

      return has;
    };

    this.create = function () {
      if (existsSync(resolve(path))) return;

      console.log(chalk.bgYellowBright(chalk.black(" WARN ")), chalk.grey(`Database#create function has been deprecated. Please use Database constructor instead.`));

      try {
        db = new JsonDatabase({ databasePath: String(path).replaceAll("/", "\\") });

        if (this.db) this.emit(Events.DatabaseCreated, chalk.cyanBright(`[Database] ${dbName} Created.`));
      } catch (err) {
        this.emit(this.Events.Error, chalk.redBright(`[DatabaseError] An error ocurred when creating "${dbName}", ${err}`));
      };
    };

    this.destroy = function () {
      if (!existsSync(resolve(path))) return;

      try {
        unlinkSync(resolve(path));

        this.emit(this.Events.DatabaseDeleted, chalk.cyanBright(`[Database] ${dbName} Deleted.`));
      } catch (err) {
        this.emit(this.Events.Error, chalk.redBright(`[DatabaseError] An error ocurred when deleting "${dbName}", ${err}`));
      };
    };
  };

  static YAML = YamlDatabase;
  static JSON = JsonDatabase;

  static Events = Events;
};