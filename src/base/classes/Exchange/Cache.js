import { CacheManager } from "../../CacheManager.js";
const MarketCache = new CacheManager(1048576000);

export const MarketsCache = MarketCache;