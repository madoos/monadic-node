# @monadic-node/fs-extra

Extension for @monadic-node/fs package

## Install

```bash
npm i @monadic-node/fs-extra
```

## Example

```js
const { readJSON } = require("@monadic-node/fs-extra");
const { pipe, __, concat, map, prop } = require("ramda")

// getVersion :: String -> Async Error String
const getVersion = pipe(
  concat(__, "/package.json"),
  readJSON,
  map(prop("version")),
)

getVersion('/some/package')
.fork(console.error, console.log) // "1.0.0"

```

## API

* readJSON :: String -> Async Error JSON
