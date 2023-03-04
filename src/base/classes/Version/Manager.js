import ChangeLog from "./ChangeLog.js";

export class VersionManager {
  versions() {
    const list = [];

    for (let index = 0; index < ChangeLog.length; index++) {
      const fetched = ChangeLog[ index ];

      list.push(fetched.version);
    };

    return list;
  };

  fetch(version = ChangeLog[ 0 ].version) {
    const versions = ChangeLog.filter((v) => v.version === version);

    return versions;
  };
};