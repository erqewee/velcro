import { Client } from "./base/classes/Client.js";
const client = new Client();

client.connect(true).catch((err) => console.log(err));