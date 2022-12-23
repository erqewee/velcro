# Supported Versions

| Version           | Supported           |
| ----------------- | ------------------- |
| Beta Release 1    | :white_check_mark:  |
| Preview Release 5 | :white_check_mark:  |
| Preview Release 4 | :white_check_mark:  |
| Preview Release 3 | :x:                 |
| Preview Release 2 | :x:                 |
| Preview Release 1 | :x:                 |

# Known Issues

- [NEW] We are investigating a bug where using the 'handleCache' function in the language system caused languages to be cached but returned "undefined" in the 'translate' function.
- We are investigating the issue not detecting saved changes after using the <b><i>REBOOT</i></b> command.

# Warnings

- We strongly recommend that you upgrade your version to 'Preview Release 4' or 'Higher' for better performance.

# Patch Notes

> Beta Release 1 (12/23/2022)

- [NOTE] This release or higher will be released to Wyvern as soon as possible. (Before Beta Release 4 or lower release arrives)

- <details>
    <summary>Added Checker</summary>
    <i>Includes new functions. (Integrated with Structures.)</i>
  </details>
- <details>
    <summary>Added Exporter</summary>
    <i>We added a new exporter to 'src/base' folder. ('export.js', this file includes all events, classes, structures and helpers.)</i>
  </details>
- <details>
    <summary>Database Updated</summary>
    <i>Some improves for <b>fetch</b>, <b>has</b>, <b>exists</b> functions.</i>
  </details>
- <details>
    <summary>Structures Updated</summary>
    <i>Added new function <b>defineProperty</b>. (You can define properties easy.)</i>
    <br>
    <i>Added new functions <b>time</b>, <b>code</b>.</i>
  </details>

> Preview Release 5 (12/18/2022)

- <details>
    <summary>Fixes</summary>
    <i>We fixed 'Process' and 'Database' are events doesn't work.</i>
  </details>
- <details>
    <summary>Database Updated.</summary>
    <i>New database events: <b>dataAddRequest</b>, <b>dataAdded</b></i>
    <br>
    <i>Database events files updated with new outputs.</i>
  </details>
- <details>
    <summary>Structures Updated</summary>
    <i>If you want to set 'Process', 'Once' or 'Database' property to "true", Please use "setProperty" function or "Event#modes" option.</i>
    <br>
    <i><b>setProperty</b> and <b>getProperty</b> functions are updated.</i>
    <br>
    <i><b>setProperties</b> and <b>getProperties</b> functions are removed.</i>
    <br>
    <i>Added new functions for <b>getProperty</b>. (editProperty added, not global only this function.)</i>
    <br>
    <i>Removed <b>Command#support</b> option. Added <b>Command#mode</b> option.</i>
  </details>
  
> Preview Release 4 (12/12/2022)

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
    <br>
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
  <br>
  <h4>Removed <b>Database#get</b> and <b>Database#create</b>. Please use <b>Database#fetch</b> and <b>Database#constructor</b> instead.</h4>
  </details>

> Preview Release 3 (12/01/2022)

- <details>
    <summary>Fixes</summary>
    <i>Fixed an issue that caused <b>TypeError: Cannot read properties of null (reading 'match')</b> error while loading events.</i>
  </details>
- <details>
    <summary>Improves</summary>
    <i>Improved src/api/API.js (Manager.js has been renamed to API.js)</i>
  </details>
- <details>
    <summary>Database Improved</summary>
    <i>Added database events support for Loader. (All database events available in "src/base/events/databases", 'databaseCreated'' event cannot work in events folder.)</i>
  </details>

> Preview Release 2 (11/27/2022)

- <details>
    <summary>New Caches</summary>
    <i>Handlers and Events are moved to Cache.</i>
  </details>
- <details>
    <summary>Improved Database</summary>
    <i>Database updated.</i>
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
        <h5>! In future versions of Wyvern, this event will no longer be available.</h5>
        <h5>& In future versions, this event will be renamed.</h5>
        <h5>Events are available in Database#Events</h5>
      </i>
    </details>
  </details>

> Preview Release (11/26/2022)

- Wyvern has been released preview version
