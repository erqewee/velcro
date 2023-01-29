import { Event } from "../../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: false, modes: ["Database"] });

    this.setName(this.Events.Database.Debug);
  };

  async execute(_path, line, column, functionName, name) {
    const path = String(_path).replace("file:///", "file://");

    return console.log(`[Database(${name})] '${functionName}()' named function used. \nPath: ${path} | ${line}:${column}`);
  };
};