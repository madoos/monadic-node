# @monadic-node/core

Core library used to transforms native NodeJS modules to modules with the same interface but returns ADTs in all methods.

As a fundamental idea the arguments in each methods will be respected, but the return value will be an ADT. To avoid inconsistencies with variadic functions and functions with optional arguments the methods are not currified.

* Contains all methods that lift (* -> a) into (Monad m => * -> m a).
* All algebraic data types are provides by [Crocks](https://crocks.dev/). 
* Contains interoperability with [fantasy land](https://github.com/fantasyland/fantasy-land).

## Install

```bash
npm i @monadic-node/core
```

## Examples

Transform all module methods:

```js
const { doWith, toIO } = require("@monadic-node/core");

const consoleIO = doWith(toIO, console);
const logHello = consoleIO.log('Hello') // return a IO ()
const logError = consoleIO.error('Error!') // return a IO ()

logHello.run() // show in console "hello"
logError.run() // // show in console error "Error!"
```

Transform modules and methods:

```js
const { doWith, toIO } = require("@monadic-node/core");

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

```

## API

### doWith:


Transform all methods of an object using the function provided. If any value of the object is not a function, no transformation is applied and the value is the same.

```bash
doWith :: Monad m => (
    (* -> a -> * -> m a), 
    {String: (* -> a)}
  ) -> { String: (* -> m a)}`
```

### toIO:

Convert the function provided into a function with the same arguments but returns an IO.

```bash
toIO :: (* -> a) -> (* -> IO a)
```

### Stream

See Stream API doc core/Stream/README.md

