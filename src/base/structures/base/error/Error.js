class BaseError extends Error {
  constructor(message) {
    super(message);
  };

  name = this.constructor.name;
};

export class InvalidType extends BaseError {
  constructor(argument, options = { expected: "String", received: "Number" }) {
    super(`The required type for '${argument}' was not specified.`);

    const { expected, received } = options;

    this.expected = expected;
    this.received = received;
  };
};

export class InvalidGuild extends BaseError {
  constructor(argument) {
    super(`${argument} is not a valid server.`);
  };
};

export class InvalidRole extends BaseError {
  constructor(argument) {
    super(`${argument} is not a valid guild role.`);
  };
};

export class InvalidChannel extends BaseError {
  constructor(argument) {
    super(`${argument} is not a valid guild channel.`);
  };
};