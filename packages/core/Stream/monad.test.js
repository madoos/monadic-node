const Stream = require(".");
const { collect } = require("./util");

describe("Monad laws", () => {
  test("M.of(a).chain(f) is equivalent to f(a)", () => {
    const x = Stream.from([1, 2]);
    const plus = x => Stream.of(x + 1);
    const y = x.chain(plus);
    return collect(y).then(xs => expect(xs).toEqual([2, 3]));
  });
});
