const console = require("./");
const { isInstanceOfIO } = require("@monadic-node/core");

describe("console monadic module", () => {
  const methods = [
    "log",
    "debug",
    "info",
    "dirxml",
    "warn",
    "error",
    "dir",
    "time",
    "timeEnd",
    "timeLog",
    "trace",
    "assert",
    "clear",
    "count",
    "countReset",
    "group",
    "groupCollapsed",
    "groupEnd",
    "table"
  ];

  test("console methods should instance of IO", () => {
    methods.forEach(method => {
      const io = console[method]("foo");
      expect(isInstanceOfIO(io)).toBe(true);
    });
  });
});
