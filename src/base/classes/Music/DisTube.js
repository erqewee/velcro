import { DisTube } from "distube";

import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { DeezerPlugin } from "@distube/deezer";
import { YtDlpPlugin } from "@distube/yt-dlp";

import { Data } from "../../../config/export.js";

import filters from "./Filters.js";

const plugins = [
  new SoundCloudPlugin(),
  new YtDlpPlugin({ update: true }),
  new DeezerPlugin({ emitEventsAfterFetching: true }),
  new SpotifyPlugin({ api: { clientId: Data.Player.Spotify.ID, clientSecret: Data.Player.Spotify.SECRET } })
];

export class Player extends DisTube {
  constructor(client) { 
    super(client, { 
      plugins, 
      savePreviousSongs: true,
      ytdlOptions: { highWaterMark: 1024 * 1024 * 64, quality: "highestaudio", format: "audioonly", liveBuffer: 60000, dlChunkSize: 1024 * 1024 * 64 },
      emitNewSongOnly: false,
      leaveOnEmpty: true,
      leaveOnFinish: true,
      leaveOnStop: true,
      savePreviousSongs: true,
      emitAddSongWhenCreatingQueue: true,
      emitAddListWhenCreatingQueue: false,
      searchSongs: 0,
      searchCooldown: 10,
      nsfw: false,
      emptyCooldown: 25,
      customFilters: filters
    }); 
  };
};