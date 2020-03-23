const { tagged } = require("daggy");
const FL = require("fantasy-land");
const T = require("./transform");
const { isFunction } = require("crocks");
const { identity: id } = require("ramda");
const es = require("event-stream");
const esReduce = require("stream-reduce");

const _TYPE = "@@/stream/type";

const Stream = tagged("Stream", ["getNodeStream"]);

// Monoid
Stream.empty = () =>
  Stream(() => {
    const readable = T.createReadable();
    readable.push(null);
    return readable;
  });

Stream.prototype.concat = function(stream) {
  return Stream(() => {
    const readable = T.createReadable();
    const next = x => readable.push(x);
    const error = e => readable.emit("error", e);
    const complete = () => readable.push(null);
    this.consume(next, error, () => stream.consume(next, error, complete));
    return readable;
  });
};

Stream.prototype[FL.concat] = Stream.prototype.concat;

// Functor
Stream.prototype.map = function(f) {
  return Stream(() => {
    const mapper = isFunction(f) ? T.map(f) : f;
    return this.getNodeStream().pipe(mapper);
  });
};

Stream.prototype[FL.map] = Stream.prototype.map;

// Apply
Stream.prototype.ap = function(stream) {
  return this.chain(x => stream.map(f => f(x)));
};

Stream.prototype[FL.ap] = Stream.prototype.ap;

// Applicative
Stream.of = value => Stream(() => T.createReadableOf(value));

Stream[FL.of] = Stream.of;

// Monad
Stream.prototype.chain = function(f) {
  return Stream(() => {
    const readable = T.createReadable();

    const next = x => {
      if (!readable._readableState.ended) {
        readable.push(x);
      }
    };

    const error = e => readable.emit("error", e);

    let isCompleteMainStream = false;
    let numSubscriptions = 0;
    let completedSubscriptions = 0;

    const completeMainStream = () => {
      isCompleteMainStream = true;
    };

    const complete = () => {
      completedSubscriptions += 1;
      const isCompleted = completedSubscriptions >= numSubscriptions;
      const hasSubscriptions = numSubscriptions > 0;

      if (hasSubscriptions && isCompleteMainStream && isCompleted) {
        readable.push(null);
      }
    };

    const join = x => {
      numSubscriptions += 1;
      f(x).consume(next, error, complete);
    };

    this.consume(join, error, () => {
      completeMainStream();
      complete();
    });

    return readable;
  });
};

// Util
Stream.createReadable = T.createReadable;

Stream.from = xs => Stream(() => T.createReadableFrom(xs));

Stream.is = x => x[_TYPE] === Stream;

Stream.prototype[_TYPE] = Stream;

// consume
Stream.prototype.consume = function(next = id, error = id, complete = id) {
  const isConsumedByWritableStream = !isFunction(next);
  const stream = this.getNodeStream();

  if (isConsumedByWritableStream) {
    next.on("error", error);
    next.on("finish", complete);
    stream.pipe(next);
  } else {
    stream.on("end", complete);
    stream.on("data", next);
    stream.on("error", error);
  }

  return stream;
};

// filterable
Stream.prototype.filter = function(predicate) {
  return Stream(() => this.getNodeStream().pipe(es.filterSync(predicate)));
};

Stream.prototype[FL.filter] = Stream.prototype.filter;

// foldable (not strict)
Stream.prototype.reduce = function(f, initial) {
  return Stream(() => this.getNodeStream().pipe(esReduce(f, initial)));
};

Stream.prototype[FL.reduce] = Stream.prototype.reduce;

module.exports = Stream;
