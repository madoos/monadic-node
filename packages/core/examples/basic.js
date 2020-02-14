const { doWith, toIO } = require("../");

const { readFileSync } = require("fs");
const { pipe, map, prop, chain } = require("ramda");

const consoleIO = doWith(toIO, console);
const readFile = toIO(readFileSync);

// showPackageName :: (String, String) -> IO ()
const showPackageName = pipe(
  readFile,
  map(JSON.parse),
  map(prop("name")),
  chain(consoleIO.log)
);

const packageNameIO = showPackageName("./package.json", "utf-8"); // IO ()

packageNameIO.run(); // show in console "@monadic-node/core"
