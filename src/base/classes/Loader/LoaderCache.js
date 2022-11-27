import { CacheManager } from "../../CacheManager.js";
const CommandCache = new CacheManager();
const HandlerCache = new CacheManager();
const EventCache = new CacheManager();


export const HandlersCache = HandlerCache;
export const EventsCache = EventCache;
export const CommandsCache = CommandCache;