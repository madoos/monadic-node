const Stream = require("../");
const { createReadStream, createWriteStream } = require("fs");
const { pipe, map } = require("ramda");
const { join } = require("path");
const minify = require("minify-stream");

// minifyScript :: String -> Stream Buffer
const minifyScript = pipe(
  path => Stream(() => createReadStream(path)),
  map(minify())
);

const src = join(__dirname, "basic.js");
const dest = join(__dirname, "basic.min.js");

// script :: Stream
const script = minifyScript(src);

script.consume(createWriteStream(dest), console.error, () =>
  console.log("Completed!")
);
