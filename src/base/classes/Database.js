import { JsonDatabase, YamlDatabase } from "wio.db";

import EventEmitter from "node:events";

import chalk from "chalk";

export class Database extends EventEmitter {
  constructor(path) {
    super();

    const db = new JsonDatabase({ databasePath: path });
    const splitPath = String(path).split("\\");
    const dbName = String(splitPath[splitPath.length - 1]).replaceAll(".json", "");

    this.on("databaseCreate", (name) => console.log(chalk.cyanBright(`[Database] ${name} Created.`)));
    if (db) this.emit("databaseCreate", dbName);

    this.set = function (key, value) {
      this.emit("dataSaveRequest", key, value);

      const set = db.set(key, value);

      const data = this.get(key);

      this.emit("dataSaved", key, value, data);

      return set;
    };

    this.del = function (key) {
      this.emit("dataDeleteRequest", key);

      const del = db.delete(key);

      this.emit("dataDeleted", key);

      return del;
    };

    this.add = function (key, value) {
      this.emit("dataSaveRequest", key, value);

      const add = db.add(key, value);

      const data = this.get(key);

      this.emit("dataSaved", key, value, data);

      return add;
    };

    this.sub = function (key, value) {
      this.emit("dataSubstrackRequest", key, value);

      const sub = db.substr(key, value);

      const data = this.get(key);

      this.emit("dataSubstracked", key, value, data);

      return sub;
    };

    this.push = function (key, value) {
      this.emit("dataPushRequest", key, value);

      const push = db.push(key, value);

      const data = this.get(key);

      this.emit("dataPushed", key, value, data);

      return push;
    };

    this.pull = function (key, callback) {
      this.emit("dataPullRequest", key, callback);

      const oldData = this.get(key);

      const pull = db.pull(key, callback);

      const newData = this.get(key);

      this.emit("dataPulled", key, callback, oldData, newData);

      return pull;
    };

    this.fetch = function (key) {
      this.emit("dataFetchRequest", key);

      const fetch = db.fetch(key);

      this.emit("dataFetched", key);

      return fetch;
    };

    this.get = function (key) {
      this.emit("dataGetRequest", key);

      const get = db.get(key);

      this.emit("dataGetted", key);

      return get;
    };

    this.has = function (key) {
      this.emit("dataHasRequest", key);

      const has = db.has(key);

      this.emit("dataHased", key);

      return has;
    };
  };

  static YAML = YamlDatabase;
  static JSON = JsonDatabase;
};