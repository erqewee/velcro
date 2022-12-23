import { LanguagesCache } from "./Cache.js";

import { Events } from "./Events.js";

import { readdirSync, statSync } from "node:fs";

import EventEmitter from "node:events";

import { resolve } from "node:path";

class Core extends EventEmitter {
  constructor(options = { languagesDir: "./src/base/languages" }) {
    super();

    const { languagesDir } = options;

    this.languages = resolve(languagesDir);
    this.cache = LanguagesCache;
    this.Events = Events;
  };

  translate(key = "welcomer", locate = "tr-TR") {
    const outKey = String(key).trim();
    const translations = LanguagesCache.get(locate);
    console.log(LanguagesCache.size)
    const object = new Object(translations);

    let parts = [];
    if (outKey.includes(".")) parts = key.split(".");
    else if (outKey.includes("/")) parts = key.split("/");
    else if (outKey.includes(">")) parts = key.split(">");

    let result = object;

    parts.map((part) => result = result[part]);

    return result;
  };

  handleCache() {
    let completed = false;

    (async () => {
      await Promise.all(readdirSync(this.languages).filter((file) => statSync(`${this.languages}/${file}`).isFile()).map(async (file) => {
        const baseFile = new (await import(`file://${this.languages}/${file}`)).default;

        const splitter = (separator = ".js", get = 0) => String(file).split(separator)[get];
        const name = splitter();

        const code = splitter(".js"); // tr-TR
        const fullCode = splitter("-"); // tr

        if (!baseFile?.translations) return;

        LanguagesCache.set(fullCode, baseFile.translations);
        LanguagesCache.set(code, baseFile.translations);

        this.emit(this.Events.LanguageLoaded, { code, source: `file://${this.languages}/${file}` });
      }));

      completed = true;
    })();

    if (completed) this.emit(this.Events.Ready, 0);

    return completed;
  };

  static Events = Events;
  static version = "v1.0.0";
};

export const Cache = LanguagesCache;
export const Language = Core;