const core = require("./");
const { identity } = require("ramda");

describe("Core module", () => {
  test(".as should transform all module methods to monadic methods", () => {
    const toArrayContext = f => (...args) => Array.of(f(...args));

    const module = {
      unaryMethod: identity,
      variadicMethod: (...args) => args,
      prop: "value"
    };

    const liftedModule = core.doWith(toArrayContext, module);

    expect(liftedModule.unaryMethod(1)).toEqual([1]);
    expect(liftedModule.variadicMethod(1, 2, 3)).toEqual([[1, 2, 3]]);
    expect(liftedModule.prop).toEqual("value");
  });

  test(".toIO should transform any (a * -> a) to (* -> IO a)", () => {
    const identityIO = core.toIO(identity);
    const collectIO = core.toIO((...args) => args);
    const oneIO = identityIO(1);
    const numbers = collectIO(1, 2, 3);

    expect(oneIO.run()).toEqual(1);
    expect(numbers.run()).toEqual([1, 2, 3]);
  });
});
