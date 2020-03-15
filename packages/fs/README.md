# @monadic-node/fs

nodeJS fs module but using Async, IO, Stream ADTs. 

* Async methods returns Async ADT.
* Sync methods returns IO ADT.
* Readable Strings methods returns Stream ADT.
* Callback methods return Stream ADT 

## Install

```bash
npm i @monadic-node/fs
```

## Example

```js
const fs = require("@monadic-node/fs");

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

getEditedFile(WORKING_DIR).consume(
  file => file.fork(console.log, console.log),
  console.log,
  console.log
);
```