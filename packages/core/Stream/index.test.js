const { map, identity } = require("ramda");
const { createReadableFrom } = require("./transform");
const { collect } = require("./util");
const { Writable, Readable, Transform } = require("readable-stream");
const Stream = require("./");

describe("Stream", () => {
  describe(".consume", () => {
    test("Should consume each value by function", done => {
      const results = [];
      const stream = new Stream(() => createReadableFrom(["a", "b", "c"]));

      stream.consume(
        val => results.push(val),
        identity,
        () => {
          expect(results).toEqual(["a", "b", "c"]);
          done();
        }
      );
    });

    test("Should consume each value by writable stream", done => {
      const results = [];
      const stream = new Stream(() => createReadableFrom(["a", "b", "c"]));

      const writable = new Writable({
        objectMode: true,
        write(val, _, next) {
          results.push(val);
          next();
        }
      });

      stream.consume(writable, identity, () => {
        expect(results).toEqual(["a", "b", "c"]);
        done();
      });
    });

    test("Should handle readable errors", done => {
      const errorMsg = "readable error";
      const stream = new Stream(() => {
        return new Readable({
          read() {
            process.nextTick(() => this.emit("error", new Error(errorMsg)));
          }
        });
      });

      stream.consume(identity, error => {
        expect(error.message).toEqual(errorMsg);
        done();
      });
    });

    test("Should handle writable errors", done => {
      const errorMsg = "writable error";
      const stream = new Stream(() => createReadableFrom(["a", "b", "c"]));

      const writable = new Writable({
        objectMode: true,
        write() {
          process.nextTick(() => this.emit("error", new Error(errorMsg)));
        }
      });

      stream.consume(writable, error => {
        expect(error.message).toEqual(errorMsg);
        done();
      });
    });
  });

  describe(".map", () => {
    const toUpper = s => s.toUpperCase();

    const toUpperTransform = () =>
      new Transform({
        objectMode: true,
        transform(s, _, next) {
          next(null, toUpper(s));
        }
      });

    test("Should apply functions for each value of stream", () => {
      const letters = new Stream(() =>
        createReadableFrom(["a", "b", "c", "d"])
      );
      return collect(letters.map(toUpper)).then(results =>
        expect(results).toEqual(["A", "B", "C", "D"])
      );
    });

    test("Should to have fantasy land interoperability", () => {
      const letters = Stream(() => createReadableFrom(["a", "b", "c", "d"]));
      return collect(map(toUpper)(letters)).then(results =>
        expect(results).toEqual(["A", "B", "C", "D"])
      );
    });

    test("Should handle errors in function", () => {
      const ErrorMsg = "error in .map method";
      const numbers = new Stream(() => createReadableFrom([1, 2, 3]));
      return collect(
        numbers.map(() => {
          throw new Error(ErrorMsg);
        })
      ).catch(e => expect(e.message).toEqual(ErrorMsg));
    });

    test("Should apply transform for each value of stream", () => {
      const letters = new Stream(() =>
        createReadableFrom(["a", "b", "c", "d"])
      );
      return collect(letters.map(toUpperTransform())).then(results =>
        expect(results).toEqual(["A", "B", "C", "D"])
      );
    });

    test("Should to have fantasy land interoperability with transforms", () => {
      const letters = new Stream(() =>
        createReadableFrom(["a", "b", "c", "d"])
      );
      const uppers = map(toUpperTransform(), letters);
      return collect(uppers).then(result =>
        expect(result).toEqual(["A", "B", "C", "D"])
      );
    });

    test("Should handle errors in transform", () => {
      const ErrorMsg = "error in .map method";
      const numbers = new Stream(() => createReadableFrom([1, 2, 3]));
      const errorTransform = new Transform({
        objectMode: true,
        transform(_, __, next) {
          next(new Error(ErrorMsg));
        }
      });

      return collect(numbers.map(errorTransform)).catch(e =>
        expect(e.message).toEqual(ErrorMsg)
      );
    });
  });

  describe("static .of", () => {
    test("Should lift a value into functor context", () => {
      const one = Stream.of(1);
      return collect(one).then(([result]) => expect(result).toEqual(1));
    });
  });

  describe("static .is", () => {
    test("Should return true if target is instance of Stream", () => {
      const one = Stream.of(1);
      expect(Stream.is(one)).toBe(true);
      expect(Stream.is(1)).toBe(false);
    });
  });
});
