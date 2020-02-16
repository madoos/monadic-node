const { tagged } = require("daggy");
const FL = require("fantasy-land");
const T = require("./transform");
const { isFunction } = require("crocks");
const { identity } = require("ramda");

const Stream = tagged("Stream", ["getNodeStream"]);

Stream.prototype.map = function(f) {
  return Stream(() => {
    const mapper = isFunction(f) ? T.map(f) : f;
    return this.getNodeStream().pipe(mapper);
  });
};

Stream.prototype[FL.map] = Stream.prototype.map;

Stream.of = value => Stream(() => T.createReadableOf(value));

Stream[FL.of] = Stream.of;

Stream.prototype.consume = function(
  next = identity,
  error = identity,
  complete = identity
) {
  const isConsumedByFunction = isFunction(next);
  const COMPLETED_EVENT = isConsumedByFunction ? "end" : "finish";

  const stream = isConsumedByFunction
    ? this.getNodeStream().on("data", next)
    : this.getNodeStream().pipe(next);

  return stream.on("error", error).on(COMPLETED_EVENT, complete);
};

module.exports = Stream;
