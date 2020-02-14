const { IO, isFunction } = require("crocks");
const { map, when } = require("ramda");

// doWith :: Monad m => ((* -> a -> * -> m a), {String: (* -> a)}) -> { String: (* -> m a)}
const doWith = (f, src) => map(when(isFunction, f), src);

// toIO :: (* -> a) -> (* -> IO a)
const toIO = f => (...args) => IO(() => f(...args));

module.exports = {
  doWith,
  toIO
};
