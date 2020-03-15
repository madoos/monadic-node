const Stream = require("../");
const { createReadStream } = require("fs");
const { pipe, map, prop, toString } = require("ramda");

// readPackageName :: String -> Stream String
const readPackageName = pipe(
  path => Stream(() => createReadStream(path)),
  map(toString),
  map(JSON.parse),
  map(prop("name"))
);

// packageName :: Stream
const packageName = readPackageName("./package.json");

packageName.consume(console.log, console.error, () =>
  console.log("Completed!")
);
/*
@monadic-node/core
Completed!
*/
