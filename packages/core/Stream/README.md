# @monadic-node/core/Stream

Native node stream from a monadic perspective.

* It can map node streams transform.
* It can be consumed by readable streams.


## Install

```bash
npm i @monadic-node/core
```

```js
const Stream = require('@monadic-node/core/Stream')
```

## Fantasy Land Implements

* Monoid
* Functor
* Applicative
* Monad
* Filterable

## Example

Basic:

```js
const Stream = require("@monadic-node/core/Stream");
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

packageName.consume(
  console.log, 
  console.error, 
  () => console.log("Completed!")
);
/*
@monadic-node/core
Completed!
*/
```
Map stream transforms:

```js
const Stream = require("@monadic-node/core/Stream");
const { createReadStream } = require("fs");
const { pipe, map, toString } = require("ramda");
const { join } = require("path");

const minify = require("minify-stream");

// minifyScript :: String -> Stream String
const minifyScript = pipe(
  path => Stream(() => createReadStream(path)),
  map(minify()), // map transform
  map(toString)
);

const file = join(__dirname, "basic.js");

// script :: Stream
const script = minifyScript(file);

script.consume(
  console.log, 
  console.error,
  () => console.log("Completed!")
)
```
Consume by write stream:

```js
const Stream = require("@monadic-node/core/Stream");
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

script.consume(
  createWriteStream(dest), // consume by stream 
  console.error, () =>
  console.log("Completed!")
);

```

## API

### .consume(next, error, complete)

Streams can be consumed using .consume by functions or writable streams.

Consumed by function:

```js
script.consume(
  console.log, // next is a function
  console.error, () =>
  console.log("Completed!")
);
```
Consumed by writable stream:

```js
script.consume(
  createWriteStream(dest), // next is a stream
  console.error, () =>
  console.log("Completed!")
);
```

## .is

```bash
is :: a -> Boolean 
```

```js
Stream.is(1) // false
Stream.is(createReadStream(file)) // true
```