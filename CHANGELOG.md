# Supported Versions

| Version           | Supported          |
| ----------------- | ------------------ |
| Preview Release 2 | :white_check_mark: |
| Preview Release   | :white_check_mark: |

# Known Issues

- We're looking for the issue that causes the `TypeError: Cannot read properties of null (reading 'match')` error when loading events.

# ChangeLogs

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
