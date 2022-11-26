import { Manager } from "../Manager.js";

export class UserManager {
  constructor() {
    this.get = async function(userID) {
      if(typeof userID !== "string") throw new TypeError("UserID must be a STRING!");

      const user = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/users/${userID}`);

      return user;
    };
  };
};