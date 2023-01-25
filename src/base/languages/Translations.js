import { Turkish } from "./tr-TR.js";
import { English } from "./en-US.js";
import { Azerbaijan } from "./az-AZ.js";

export class Translations {
  constructor() {};

  Languages = [
    {
      code: "tr-TR",
      source: Turkish // from another file
    },
    {
      code: "en-US",
      source: English
    },
    {
      code: "az-AZ",
      source: Azerbaijan
    }
  ];
};