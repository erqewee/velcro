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