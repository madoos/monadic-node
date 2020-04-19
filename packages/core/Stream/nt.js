const Stream = require("./");
const { curryN, init, last, is } = require("ramda");
const { Async } = require("crocks");

const isFunction = is(Function);

const overloadForFunctions = nt => {
  return curryN(nt.length, (...args) => {
    const target = last(args);
    const params = init(args);

    return isFunction(target)
      ? curryN(target.length, (...args) => {
          return nt(...params, target(...args));
        })
      : nt(...args);
  });
};

const asyncToStream = f => (...args) => {
  return Stream(() => {
    const readable = Stream.createReadable();
    const async = f(...args);
    async.fork(
      e => readable.emit("error", e),
      x => {
        readable.push(x);
        readable.push(null);
      }
    );

    return readable;
  });
};

const streamToAsync = stream => {
  return Async((reject, resolve) => {
    let last;
    stream.consume(
      x => {
        last = x;
      },
      reject,
      () => resolve(last)
    );
  });
};

module.exports = {
  asyncToStream,
  streamToAsync: overloadForFunctions(streamToAsync)
};
