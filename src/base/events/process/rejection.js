import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({ enabled: true, modes: ["Process"] });

          this.setName("unhandledRejection");

          this.execute = function (data) {
               return console.log(data);
          };
     };
};