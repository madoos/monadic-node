const { IO, isFunction, Async } = require("crocks");
const { mapObjIndexed, when } = require("ramda");
const isSameType = require("crocks/core/isSameType");
const Stream = require("./Stream");

// doWith :: Monad m => ((* -> a -> * -> m a), {String: (* -> a)}) -> { String: (* -> m a)}
const doWith = (f, src) => mapObjIndexed(when(isFunction, f), src);

// toIO :: (* -> a) -> (* -> IO a)
const toIO = f => (...args) => IO(() => f(...args));

// isInstanceOfIO :: a -> Boolean
const isInstanceOfIO = x => isSameType(x, IO);

// toAsync :: * -> a -> * -> Async e a
const toAsync = f => (...args) =>
  Async((rej, res) => {
    f(...args, (e, x) => (e ? rej(e) : res(x)));
  });

// isInstanceOfAsync :: a -> Boolean
const isInstanceOfAsync = x => isSameType(x, Async);

// toStream: (* -> NodeJSStream a) -> (* -> Stream a)
const toStream = f => (...args) => Stream(() => f(...args));

// isInstanceOfStream :: a -> Boolean
const isInstanceOfStream = Stream.is;

module.exports = {
  doWith,
  toIO,
  isInstanceOfIO,
  toAsync,
  isInstanceOfAsync,
  toStream,
  isInstanceOfStream
};
