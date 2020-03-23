const Stream = require("./");
const { createReadableFrom } = require("./transform");
const { isEquivalent, collect } = require("./util");
const { T, F, __, gte, lte, both, filter } = require("ramda");

describe("Filterable Laws", () => {
  const stream = Stream(() => createReadableFrom([1, 2, 3]));

  test('Identity "x.filter(val => true) === x"', () => {
    const x = stream;
    const y = x.filter(T);
    return isEquivalent(x, y).then(result => expect(result).toBe(true));
  });

  test('annihilation "x.filter(val => false) === y.filter(val => false)"', () => {
    const x = Stream(() => createReadableFrom([1, 2, 3]));
    const y = Stream(() => createReadableFrom(["a", "b", "c"]));

    return isEquivalent(x.filter(F), y.filter(F)).then(result =>
      expect(result).toBe(true)
    );
  });

  test('distributivity "x.filter(val => f(x) && g(x)) === x.filter(f).filter(g)"', () => {
    const lte2 = lte(__, 2);
    const gte3 = gte(__, 3);

    const x = Stream(() => createReadableFrom([1, 2, 3, 4, 5]));
    const y = x.filter(lte2).filter(gte3);
    const z = x.filter(both(lte2, gte3));

    return isEquivalent(y, z).then(result => expect(result).toBe(true));
  });

  test("Should to have fantasy land interoperability", () => {
    const x = Stream(() => createReadableFrom([1, 2, 3, 4, 5]));
    const y = filter(gte(__, 3), x);
    return collect(y).then(result => expect(result).toEqual([3, 4, 5]));
  });
});
