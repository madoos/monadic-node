# @monadic-node/console

nodeJS console module but using IO. All method executions return an IO instance.

## Install

```bash
npm i @monadic-node/console
```

## Example

```js
const console = require("@monadic-node/console");
const { pipe, chain } = require("ramda");

// showInfo :: String -> IO ()
const showMonadSpec = pipe(
  console.log,
  chain(() => console.group()),
  chain(() => console.log("Functor")),
  chain(() => console.group()),
  chain(() => console.log("Apply")),
  chain(() => console.group()),
  chain(() => console.log("Applicative")),
  chain(() => console.group()),
  chain(() => console.log("Monad")),
  chain(() => console.groupEnd()),
  chain(() => console.groupEnd()),
  chain(() => console.groupEnd()),
  chain(() => console.groupEnd())
);

// monadSpec :: IO ()
const monadSpec = showMonadSpec("Fantasy Land:"); // IO ()

monadSpec.run(); // Show in console:
/*
Fantasy Land:
  Functor
    Apply
      Applicative
        Monad
*/
```

## API

See nodeJS [console](https://nodejs.org/api/console.html) methods. 