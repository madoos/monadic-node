const { IO, isFunction, Async } = require("crocks");
const {
  mapObjIndexed,
  when,
  test,
  complement,
  map,
  adjust,
  always,
  cond
} = require("ramda");
const isSameType = require("crocks/core/isSameType");
const Stream = require("./Stream");

// isClassConstructor :: String -> Boolean
const isNotAClass = complement(test(/^[A-Z]/));

// doWith :: Monad m => ((* -> a -> * -> m a), {String: (* -> a)}) -> { String: (* -> m a)}
const doWith = (fLift, src) =>
  mapObjIndexed(
    (f, name) =>
      when(
        f => isFunction(f) && isNotAClass(name),
        f => fLift(f, name)
      )(f),
    src
  );

// doWithCond :: Monad m => ([[(String -> Boolean),(* -> a -> * m a)]], { String: * -> a}) -> { String: * -> m a }
const doWithCond = (xs, src) => {
  const conditions = map(adjust(1, always), xs);
  const handleType = cond(conditions);
  return doWith((f, name) => handleType(name)(f), src);
};

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

// callbackToStream :: (* -> undefined) -> (* -> Stream a)
const callbackToStream = f => (...args) =>
  Stream(() => {
    const readable = Stream.createReadable();
    f(...args, (...xs) => readable.push(xs));
    return readable;
  });

// isInstanceOfStream :: a -> Boolean
const isInstanceOfStream = Stream.is;

module.exports = {
  isNotAClass,
  doWithCond,
  doWith,
  toIO,
  isInstanceOfIO,
  toAsync,
  isInstanceOfAsync,
  toStream,
  isInstanceOfStream,
  callbackToStream
};
