const { Transform, Readable } = require("readable-stream");

// createReadable :: () -> NodeStream
const createReadable = () => new Readable({ objectMode: true, read() {} });

// createReadableOf :: a -> ReadableStream a
const createReadableOf = value => {
  const stream = createReadable();
  stream.push(value);
  stream.push(null);
  return stream;
};

// createReadableFrom :: Iterable i => i -> ReadableStream i
const createReadableFrom = values => {
  const stream = createReadable();

  for (let item of values) {
    stream.push(item);
  }

  stream.push(null);
  return stream;
};

// map :: (a -> b) -> Transform b
const map = f =>
  new Transform({
    objectMode: true,
    transform(x, _, next) {
      try {
        next(null, f(x));
      } catch (e) {
        next(e);
      }
    }
  });

module.exports = {
  createReadableOf,
  createReadableFrom,
  createReadable,
  map
};
