import { Turkish } from "./tr-TR.js";

export class Translations {
  constructor() {};

  Languages = [
    {
      code: "tr-TR",
      source: Turkish // from another file
    },
    {
      code: "en-US",
      source: {
        welcomer: "Hello!"
      }
    },
    {
      code: "az-AZ",
      source: {
        welcomer: "Salam!"
      }
    }
  ];
};