# Supported Versions

| Version           | Supported          |
| ----------------- | ------------------ |
| Preview Release 4 | :white_check_mark: |
| Preview Release 3 | :white_check_mark: |
| Preview Release 2 | :x:                |
| Preview Release 1 | :x:                |

# Known Issues

- We are investigating the issue of not detecting saved changes after using the <b><i>REBOOT</i></b> command.

# Warnings

- [Preview Release 4] We now testing our new Structure functions.
- We strongly recommend that you upgrade your version to 'Preview Release 3' or 'Higher' for better performance.

# ChangeLogs

> Preview Release 4 (12/04/2022)

- <details>
    <summary>Fixes</summary>
    <i>When using interactions (not Command Interaction) you see a <b>TypeError: Cannot read property of undefined (reading 'execute')</b> error.</i>
  </details>
- <details>
    <summary>New Command</summary>
    <i>Survey named command added. (This is an experimental feature)</i>
  </details>
- <details>
    <summary>Structures Changed</summary>
    <i>Command and Event structures updated.</i>
    <i>Added new functions. (setProperty, setProperties, getProperty, getProperties) (This functions experimental feature.)</i>
  </details>
- <details>
    <summary>Optimizations</summary>
    <i>Pagination optimized.</i>
    <i>Structures optimized.</i>
  </details>
- <details>
    <summary>Database Updated</summary>
     <details>
     <summary>Events Changed</summary>
     <i>
     dataSubstrackRequest named event has been renamed to dataSubtractRequest<br>
     dataSubstracked named event has been renamed to dataSubtracted<br><br>
     
     New events: dataExistsRequest, dataExisted, databaseDestroyRequest, databaseDestroyed
     </i>
     </details>
     
  <h4>Added new function <b>Database#exists</b></h4>
  <h4>Removed <b>Database#get</b> and <b>Database#create</b>. Please use <b>Database#fetch</b> and <b>Database#constructor</b> instead.</h4>
  </details>

> Preview Release 3 (12/01/2022)

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
       dataSubstrackRequest &<br>
       dataSubstracked &<br>
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
      <h5>! This event is removed fully in Wyvern's future versions.</h5>
      <h5>& This event is renamed in future versions.</h5>
      <h5>Events are available in Database#Events</h5>
    </i>
  </details>

> Preview Release (11/26/2022)

- Wyvern has been released preview version
