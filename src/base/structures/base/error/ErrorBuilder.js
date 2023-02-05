import { s } from "@sapphire/shapeshift";

export class ErrorBuilder extends Error {
  constructor(checker, options = { name: "FatalError", message: "A error ocurred.", type: "InvalidType", expected: "String", received: null, conditions: [ false ] }) {
    super();

    const { name, message, type, expected, received, conditions } = options;

    s.string.parse(name);
    s.string.parse(message);
    s.string.parse(type);

    this.name = name;
    this.message = message;
    this.type = type;
    this.conditions = conditions;

    this.expected = expected;
    this.received = received ?? checker.toString();

    this.checker = checker;
  };

  setName(name) {
    s.string.parse(name);

    this.name = name;

    return this;
  };

  setMessage(content) {
    s.string.parse(content);

    this.message = content;

    return this;
  };

  setCondition(...conditions) {
    const settedConditions = [];

    for (let index = 0; index < conditions.length; index++) {
      const condition = conditions[ index ];

      settedConditions.push(this.checker[ condition ]);
    };

    this.conditions = settedConditions;

    return this;
  };

  setType(type) {
    s.string.parse(type);

    this.type = type;

    return this;
  };

  throw() {
    for (let index = 0; index < this.conditions.length; index++) {
      const condition = this.conditions[ index ];

      if (condition === true && (this.checker.isNotUndefined && this.checker.isNotNull)) throw this;
    };
  };
};