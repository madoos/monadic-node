const Stream = require("./");
const { createReadableFrom } = require("./transform");
const { isEquivalent } = require("./util");
const { identity, inc, multiply, pipe, map } = require("ramda");

describe("Functor Laws", () => {
  const stream = Stream(() => createReadableFrom([1, 2, 3]));

  test('Identity "x.map(val => val) === x"', () => {
    const x = stream;
    const y = x.map(identity);
    return isEquivalent(x, y).then(result => expect(result).toBe(true));
  });

  test("Identity Fantasy land interoperability", () => {
    const x = stream;
    const y = map(identity, x);
    return isEquivalent(x, y).then(result => expect(result).toBe(true));
  });

  test("Composition Fantasy land interoperability", () => {
    const src = stream;
    const f = multiply(10);
    const x = pipe(map(inc), map(f))(src);
    const y = map(pipe(inc, f), src);
    return isEquivalent(x, y).then(result => expect(result).toBe(true));
  });
});
