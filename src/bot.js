import { ClusterManager } from "discord-hybrid-sharding";

import { Data } from "./config/export.js";

const manager = new ClusterManager("./src/index.js", {
  totalClusters: 1,
  totalShards: 2,
  shardsPerClusters: 4,

  token: Data.Bot.TOKEN,

  mode: "process"
});

manager.on("clusterReady", (cluster) => {}); //console.log("[ShardManager] Cluster Ready. (ID: {id})".replace("{id}", cluster.id)));
manager.on("clusterCreate", (cluster) => {
  /*
  let id = cluster.id;

  console.log("[ShardManager] New Cluster Created. (ID: {id})".replace("{id}", id));

  cluster.on("clientRequest", (message) => console.log("[ShardManager] Client Requested for Client. (ID: {id})".replace("{id}", id)));
  cluster.on("spawn", (thread) => console.log("[ShardManager] Cluster Spawned. (ID: {id})".replace("{id}", id)));
  cluster.on("message", (message) => console.log("[ShardManager] New Message Received from Cluster. {msg} (ID: {id})".replace("{msg}", message).replace("{id}", id)));
  cluster.on("error", (error) => console.log("[ShardManager] An error ocurred in Cluster. {err} (ID: {id})".replace("{err}", error).replace("{id}", id)));
  */
});

manager.spawn({ timeout: -1 });