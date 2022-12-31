import { CacheManager as Cache } from "./CacheManager.js";

const ChannelsCache = new Cache();
const EmojisCache = new Cache();
const GuildsCache = new Cache();
const InvitesCache = new Cache();
const MembersCache = new Cache();

export { ChannelsCache, EmojisCache, GuildsCache, InvitesCache, MembersCache };