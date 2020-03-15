const {
  doWithCond,
  toIO,
  toAsync,
  toStream,
  callbackToStream
} = require("@monadic-node/core");
const { includes, T, equals } = require("ramda");

const fs = require("fs");

module.exports = doWithCond(
  [
    [equals("watch"), callbackToStream],
    [equals("watchFile"), callbackToStream],
    [includes("Stream"), toStream],
    [includes("Sync"), toIO],
    [T, toAsync]
  ],
  fs
);
