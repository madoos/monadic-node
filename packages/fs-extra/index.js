const { readFile } = require("@monadic-node/fs");

const { map, toString, pipe } = require("ramda");
const { parse } = JSON;

// readJSON :: String -> Async Error JSON
const readJSON = pipe(readFile, map(pipe(toString, parse)));

module.exports = {
  readJSON
};
