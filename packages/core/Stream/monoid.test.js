const Stream = require("./");
const { createReadableOf } = require("./transform");
const { collect } = require("./util");
const { concat } = require("ramda");

describe("Stream Monoid laws m.concat(M.empty())", () => {
  test("Right Identity", () => {
    const value = 1;
    const stream = Stream(() => createReadableOf(value)).concat(Stream.empty());
    return collect(stream).then(values => expect(values).toEqual([value]));
  });

  test("Right Identity Fantasy Land Spec concat(m, M.empty())", () => {
    const value = 1;

    const stream = concat(
      Stream(() => createReadableOf(value)),
      Stream.empty()
    );

    return collect(stream).then(values => expect(values).toEqual([value]));
  });

  test("Left identity M.empty().concat(m)", () => {
    const value = 1;
    const stream = Stream.empty().concat(Stream(() => createReadableOf(value)));
    return collect(stream).then(values => expect(values).toEqual([value]));
  });

  test("Left Identity Fantasy Land Spec concat(M.empty(), m)", () => {
    const value = 1;

    const stream = concat(
      Stream.empty(),
      Stream(() => createReadableOf(value))
    );

    return collect(stream).then(values => expect(values).toEqual([value]));
  });
});
