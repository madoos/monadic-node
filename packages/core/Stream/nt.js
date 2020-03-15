const Stream = require("./");

const asyncToStream = f => (...args) => {
  return Stream(() => {
    const readable = Stream.createReadable();
    const async = f(...args);
    async.fork(
      x => {
        readable.push(x);
        readable.push(null);
      },
      e => readable.emit("error", e)
    );

    return readable;
  });
};

module.exports = {
  asyncToStream
};
