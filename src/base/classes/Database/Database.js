import EventEmitter from "node:events";
import chalk from "chalk";

import { JsonDatabase, YamlDatabase } from "wio.db";
import { unlinkSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import { Events } from "./Events.js";

export class Database extends EventEmitter {
  constructor(databaseOptions = { path: null, dir: null, name: "MyDatabase" }) {
    super();

    const { path, dir, name } = databaseOptions;

    this.path = path;
    this.dir = dir;
    this.name = name;

    this.Events = Events;

    const fullPath = `${this.path}/${this.dir}/${this.name}.json`;

    this.database = new JsonDatabase({ databasePath: String(fullPath).replaceAll("/", "\\") });

    this.setMaxListeners(0);

    this.set = function (key = "ErqeweeDevelopment.Discord", value = "https://discord.gg/ZwhgJvXqm9") {
      this.emit(this.Events.DataSaveRequest, key, value, name);

      this.database.set(key, value);
      const data = this.fetch(key);

      this.emit(this.Events.DataSaved, key, value, data, name);

      return { data, del: this.del };
    };

    this.del = function (key = "ErqeweeDevelopment") {
      this.emit(this.Events.DataDeleteRequest, key, name);

      const data = this.fetch(key);
      this.database.delete(key);

      this.emit(this.Events.DataDeleted, key, data, name);

      return { data, set: this.set };
    };

    this.add = function (key = "ErqeweeDevelopment.GitLab", value = "https://gitlab.com/erqewee") {
      this.emit(this.Events.DataAddRequest, key, value, name);

      const oldData = this.fetch(key);
      this.database.add(key, value);
      const newData = this.fetch(key);

      this.emit(this.Events.DataAdded, key, value, oldData, newData, name);

      return { oldData, newData, sub: this.sub };
    };

    this.sub = function (key = "ErqeweeDevelopment.Projects.COUNT", value = 1) {
      this.emit(this.Events.DataSubtractRequest, key, value, name);

      const oldData = this.fetch(key);
      this.database.substr(key, value);
      const newData = this.fetch(key);

      this.emit(this.Events.DataSubtracted, key, value, oldData, newData, name);

      return { oldData, newData, add: this.add };
    };

    this.push = function (key = "ErqeweeDevelopment.Projects.Active", value = "Wyvern") {
      this.emit(this.Events.DataPushRequest, key, value, name);

      const oldData = this.fetch(key);
      this.database.push(key, value);
      const newData = this.fetch(key);

      this.emit(this.Events.DataPushed, key, value, oldData, newData, name);

      return { oldData, newData, pull: this.pull };
    };

    this.pull = function (key = "ErqeweeDevelopment.Projects.Active", callback = (data) => data === "Wyvern") {
      this.emit(this.Events.DataPullRequest, key, callback, name);

      const oldData = this.fetch(key);
      this.database.pull(key, callback);
      const newData = this.fetch(key);

      this.emit(this.Events.DataPulled, key, callback, oldData, newData, name);

      return { oldData, newData, push: this.push };
    };

    this.fetch = function (key = "ErqeweeDevelopment", fetchAllOptions = { enabled: false, limit: 3 }) {
      const { limit, enabled } = fetchAllOptions;

      this.emit(this.Events.DataFetchRequest, key, name);

      if (key && enabled) console.log(chalk.bgYellowBright(" WARN "), chalk.grey(`You cannot use 'fetchAll' with a key. Please replace '${key}' with 'null' or disable 'fetchAll' mode.`));

      const fetch = enabled ? this.database.fetchAll(limit) : this.database.fetch(key);

      this.emit(this.Events.DataFetched, key, fetch, name);

      return fetch;
    };

    this.has = function (key = "ErqeweeDevelopment") {
      this.emit(this.Events.DataHasRequest, key, name);

      const has = this.database.has(key);
      const data = this.exists(key) ? this.fetch(key) : null;

      this.emit(this.Events.DataHashed, key, data, name);

      return has;
    };

    this.exists = function (key = "ErqeweeDevelopment") {
      this.emit(this.Events.DataExistsRequest, key, name);

      const exist = this.database.exists(key);
      const data = exist ? this.fetch(key) : null;

      this.emit(this.Events.DataExisted, key, data, name);

      return exist;
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