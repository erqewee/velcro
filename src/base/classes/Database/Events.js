export const Events = {
  DatabaseCreated: "databaseCreated", // This event is removing fully in future versions.

  DatabaseDestroyRequest: "databaseDestroyRequest",
  DatabaseDestroyed: "databaseDestroyed",

  DataSaveRequest: "dataSaveRequest",
  DataSaved: "dataSaved",

  DataAddRequest: "dataAddRequest",
  DataAdded: "dataAdded",

  DataDeleteRequest: "dataDeleteRequest", 
  DataDeleted: "dataDeleted",

  DataSubtractRequest: "dataSubtractRequest",
  DataSubtracted: "dataSubtracted",

  DataPushRequest: "dataPushRequest",
  DataPushed: "dataPushed",

  DataPullRequest: "dataPullRequest",
  DataPulled: "dataPulled",

  DataFetchRequest: "dataFetchRequest",
  DataFetched: "dataFetched",

  DataHasRequest: "dataHasRequest",
  DataHashed: "dataHashed",

  DataExistsRequest: "dataExistsRequest",
  DataExisted: "dataExisted",

  Error: "error"
};