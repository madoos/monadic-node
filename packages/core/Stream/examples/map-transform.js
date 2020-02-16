const Stream = require("../");
const { createReadStream } = require("fs");
const { pipe, map, toString } = require("ramda");
const { join } = require("path");
const minify = require("minify-stream");

// minifyScript :: String -> Stream String
const minifyScript = pipe(
  path => Stream(() => createReadStream(path)),
  map(minify()),
  map(toString)
);

const file = join(__dirname, "basic.js");

// script :: Stream
const script = minifyScript(file);

script.consume(console.log, console.error, () => console.log("Completed!"));
