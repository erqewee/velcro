import { LanguagesCache } from "./Cache.js";

import { Events } from "./Events.js";

import { readdirSync, statSync } from "node:fs";

import EventEmitter from "node:events";

import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

class Core extends EventEmitter {
  constructor(coreOptions = { languages: [{ code: "tr-TR", source: "../../languages/tr-TR.yml" }, { code: "en-US", source: "../../languages/en-US.yml" }] }) {
    super();

    const { languages } = coreOptions;

    this.translate = function (key = "test:test", options = { locale: "enGB" }) {
      return i18next.t(key, { lng: options.locale.replaceAll("-", "") })
    };

    this.init = async function () {

      const basePath = resolve("./src/base/languages");
      const nsNames = [];
      
      await Promise.all(readdirSync(basePath).filter((dir) => statSync(`${basePath}/${dir}`).isDirectory()).map(async (dir) => {
        nsNames.push(dir);

        await Promise.all(readdirSync(`${basePath}/${dir}`).filter((file) => statSync(`${basePath}/${dir}/${file}`).isFile()).map((file) => {
          console.log(file.split(".")[0])
        }))
      }));

      return i18next.use(Backend).init({
        debug: true,
        backend: {
          loadPath: resolve(`./src/base/languages/{{lng}}/{{ns}}.yml`),
        },
         interpolation: {
          escapeValue: false
        },
        ns: nsNames,
        unescapePrefix: false,
        whitelist: ["enUS", "tr"], 
        defaultNS: false,
        fallbackLng: ['enUS', 'tr'],
        lng: "enUS" 
      })
    };

    this.handleCache = async function () {
      await Promise.all(languages.map(async (data, index) => {
        const file = (await import(resolve(data.source)));

        this.cache.set(data.code, file);

        this.emit(this.Events.LanguageLoaded, { code: data.code, source: data.source });
      }));

      this.emit(this.Events.Ready, true);
    }; // nu nu nu⚡

    this.cache = LanguagesCache;
    this.Events = Events;
  };

  static Events = Events;
  static version = "v1.0.0";
};

export const Cache = LanguagesCache;
export const Language = Core;