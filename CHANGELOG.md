# Supported Versions

| Version           | Supported          |
| ----------------- | ------------------ |
| Preview Release 3 | :white_check_mark: |
| Preview Release 2 | :white_check_mark: |
| Preview Release 1 | :white_check_mark: |

# Known Issues

- We are investigating the issue of not detecting saved changes after using the <b><i>REBOOT</i></b> command.

# Warnings

> Preview Release 2 and higher versions

- Database#get deprecated. Please use Database#fetch instead. (This function is removing fully in Wyvern's future versions.)

# ChangeLogs

> Preview Release 3 (01/01/2022)

- Fixed an issue that caused `TypeError: Cannot read properties of null (reading 'match')` error while loading events.
- Improved src/api/API.js (Manager.js has been renamed to API.js)
- Added database events support for Loader. (All database events available in "src/base/events/databases", 'databaseCreated'' event cannot work in events folder.)

> Preview Release 2 (11/27/2022)

- Handlers and Events are moved to Cache.
- Improved Database
  <details>
  <summary>News</summary>
  - Database#get deprecated. Please use Database#fetch instead. (This function is removing fully in Wyvern's future versions.)
  <br>
  - Added events.
  </details>
  <details>
    <summary>Available Events</summary>
    <i>
       databaseCreated<br>
       databaseDeleted<br>
       dataSaveRequest<br>
       dataSaved<br>
       dataDeleteRequest<br> 
       dataDeleted<br>
       dataSubstrackRequest<br>
       dataSubstracked<br>
       dataPushRequest<br>
       dataPushed<br>
       dataPullRequest<br>
       dataPulled<br>
       dataFetchRequest<br>
       dataFetched<br>
       dataGetRequest !<br>
       dataGetted !<br>
       dataHasRequest<br>
       dataHased<br>
       error<br>
    </i>
    <i>
      <h5>! This event is removing fully in Wyvern's future versions.</h5>
      <h5>Events are available in Database#Events</h5>
    </i>
  </details>

> Preview Release (11/26/2022)

- Wyvern has been released preview version
