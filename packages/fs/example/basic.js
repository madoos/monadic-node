const fs = require("../");

const { watch, readFile } = fs;
const { join } = require("path");
const { concat, nth, map, pipe, toString } = require("ramda");

const WORKING_DIR = join(__dirname, "../");

const getEditedFile = pipe(
  watch,
  map(nth(1)),
  map(concat(WORKING_DIR)),
  map(readFile),
  map(map(toString))
);

console.log(WORKING_DIR);

getEditedFile(WORKING_DIR).consume(
  file => file.fork(console.log, console.log),
  console.log,
  console.log
);
