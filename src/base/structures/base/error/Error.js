import { redBright, blueBright, greenBright } from "colorette";

class BaseError extends Error {
  constructor(message) {
    super(message);
  };

  name = this.constructor.name;
};

export class InvalidType extends BaseError {
  constructor(argument, options = { expected: [], received: "Number" }) {
    super(`The required type for '${redBright(argument)}' was not specified.`);

    const { expected, received } = options;

    this.expected = expected;
    this.received = received;
  };
};

export class InvalidGuild extends BaseError {
  constructor(argument) {
    super(`'${redBright(argument)}' is not a valid server.`);
  };
};

export class InvalidRole extends BaseError {
  constructor(argument) {
    super(`'${redBright(argument)}' is not a valid guild role.`);
  };
};

export class InvalidChannel extends BaseError {
  constructor(argument) {
    super(`'${redBright(argument)}' is not a valid guild channel.`);
  };
};

export class NotFound extends BaseError {
  constructor(argument) {
    super(`'${redBright(argument)}' not found.`);
  };
};

export class LanguageNotFound extends BaseError {
  constructor(argument, options = { locate: null, path: "" }) {
    const { path, locate } = options;

    let message = `No translations were found for '${redBright(argument)}'. Check the '${blueBright("Path")}' and try again.`;
    if (locate) message = `No language resource found for '${redBright(locate)}'.`;

    super(message);

    this.code = 0;

    this.path = path;
    this.locate = locate;
  };
};

export class NotRequestedFormat extends BaseError {
  constructor(argument, options = { expected: [], received: "aa,bb" }) {
    super(`'${redBright(argument)}' is not in the requested format.`);

    const { expected, received } = options;

    this.expected = expected;
    this.received = received;
  };
};

export class DataLimitExceeded extends BaseError {
  constructor(name, storageSize, maxLimit) {
    super(`The maximum data limit of '${greenBright(name)}' has been exceeded.`);

    this.size = storageSize;
    this.maxLimit = maxLimit;
  };
};