const { IO, isFunction } = require("crocks");
const { map, when } = require("ramda");
const isSameType = require("crocks/core/isSameType");

// doWith :: Monad m => ((* -> a -> * -> m a), {String: (* -> a)}) -> { String: (* -> m a)}
const doWith = (f, src) => map(when(isFunction, f), src);

// toIO :: (* -> a) -> (* -> IO a)
const toIO = f => (...args) => IO(() => f(...args));

// isInstanceOfIO :: a -> Boolean
const isInstanceOfIO = x => isSameType(x, IO);

module.exports = {
  doWith,
  toIO,
  isInstanceOfIO
};
