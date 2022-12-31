import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

export class UserManager {
  constructor() { };

  async get(userID) {
    if (!api.checker.check(userID).isString()) api.checker.error("userId", "InvalidType", { expected: "String", received: (typeof userID) });
    
    const user = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/users/${userID}`);

    return user;
  };
};