const core = require("./");
const { identity } = require("ramda");
const { Readable } = require("stream");
const { includes, T } = require("ramda");

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

  describe(".toAsync", () => {
    const toPromise = async => new Promise((res, rej) => async.fork(rej, res));

    test(".toAsync should transform a node callback function with variadic args to Async variadic function", () => {
      const sum = core.toAsync((a, b, c, cb) => cb(null, a + b + c));
      return toPromise(sum(1, 1, 1)).then(two => expect(two).toEqual(3));
    });

    test(".toAsync should transform a node callback function without  args to Async function with args", () => {
      const alwaysT = core.toAsync(cb => cb(null, true));
      return toPromise(alwaysT()).then(t => expect(t).toEqual(true));
    });

    test(".toAsync should handle a node callback errors", () => {
      const ERROR_MSG = "error";
      const callWithError = core.toAsync(cb => cb(ERROR_MSG));
      return toPromise(callWithError()).catch(e =>
        expect(e).toEqual(ERROR_MSG)
      );
    });
  });

  test(".isInstanceOfAsync should return true if is instance of Stream", () => {
    const identityAsync = core.toAsync((x, cb) => cb(null, x));
    expect(core.isInstanceOfAsync(identityAsync(1))).toBe(true);
    expect(core.isInstanceOfAsync(1)).toBe(false);
  });

  describe(".toStream", () => {
    const createReadableOf = value => {
      const stream = new Readable({ objectMode: true, read() {} });
      stream.push(value);
      stream.push(null);
      return stream;
    };

    test("Should transform any (a * -> NodeJSStream a) to (* -> Stream a)", done => {
      const identityStream = core.toStream(n => createReadableOf(n));
      identityStream(1).consume(n => {
        expect(n).toEqual(1);
        done();
      });
    });
  });

  test(".doWithCond should lift methods in module using the conditions", () => {
    const toUnaryArray = f => x => [f(x)];
    const toVariadicArray = f => (...args) => [[f(...args)]];

    const src = {
      unary: n => n + 1,
      variadic: (a, b, c) => a + b + c,
      ClassExample: () => true,
      prop: "value"
    };

    const result = core.doWithCond(
      [
        [includes("unary"), toUnaryArray],
        [T, toVariadicArray]
      ],
      src
    );

    expect(result.unary(1)).toEqual([2]);
    expect(result.variadic(1, 2, 3)).toEqual([[6]]);
    expect(result.ClassExample).toEqual(src.ClassExample);
    expect(result.prop).toEqual("value");
  });

  test(".callbackToStream", done => {
    const identityCallBack = (x, cb) => cb(x);
    const identityStream = core.callbackToStream(identityCallBack);

    identityStream(1).consume(x => {
      expect(x).toEqual([1]);
      done();
    });
  });
});
