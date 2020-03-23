const Stream = require("./");
const { createReadableFrom } = require("./transform");
const { collect } = require("./util");
const { add, reduce } = require("ramda");

describe("Foldable Laws", () => {
  const x = Stream(() => createReadableFrom([1, 2, 3, 4, 5]));

  test("Should fold", () => {
    return collect(x.reduce(add, 0)).then(result => {
      expect(result).toEqual([15]);
    });
  });

  test("Should to have fantasy land interoperability", () => {
    return collect(reduce(add)(0)(x)).then(result => {
      expect(result).toEqual([15]);
    });
  });
});
