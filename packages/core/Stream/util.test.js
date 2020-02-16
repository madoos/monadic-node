const { createReadableFrom } = require("./transform");
const Stream = require("./");
const { collect } = require("./util");

describe("util", () => {
  test(".collect should collect data from a stream", () => {
    const stream = Stream(() => createReadableFrom([1, 2]));
    return collect(stream).then(results => expect(results).toEqual([1, 2]));
  });
});
