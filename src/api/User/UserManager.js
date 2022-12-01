import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

export class UserManager {
  constructor() {
    this.get = async function (userID) {
      if (userID && typeof userID !== "string") throw new TypeError("UserID must be a STRING!");

      const user = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/users/${userID}`);

      return user;
    };
  };
};