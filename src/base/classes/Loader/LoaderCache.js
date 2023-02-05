import { CacheManager } from "../../CacheManager.js";
const SlashCommandCache = new CacheManager();
const ContextCommandCache = new CacheManager();
const HandlerCache = new CacheManager();
const EventCache = new CacheManager();
const LanguageCache = new CacheManager();
const CooldownCache = new CacheManager();


export const HandlersCache = HandlerCache;
export const EventsCache = EventCache;
export const CooldownsCache = CooldownCache;
export const CommandsCache = { slash: SlashCommandCache, context: ContextCommandCache };
export const LanguagesCache = LanguageCache;