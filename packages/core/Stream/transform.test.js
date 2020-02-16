const { Readable } = require("readable-stream");
const { map, createReadableOf, createReadableFrom } = require("./transform");
const { collect } = require("./util");

describe(".map", () => {
  test(".map should transform each stream item ", () => {
    const stream = new Readable({ objectMode: true, read() {} });
    stream.push(1);
    stream.push(2);
    stream.push(null);

    return collect(stream.pipe(map(n => n + 1))).then(results => {
      expect(results).toEqual([2, 3]);
    });
  });

  test(".map should handle errors", done => {
    const stream = new Readable({ objectMode: true, read() {} });
    stream.push(1);
    stream.push(null);

    stream
      .pipe(
        map(() => {
          throw new Error("Some error");
        })
      )
      .on("error", e => {
        expect(e.message).toEqual("Some error");
        done();
      });
  });
});

describe(".createReadableOf", () => {
  test(".createReadableOf should create stream of value", () => {
    const value = { id: 1 };
    const stream = createReadableOf(value);
    return collect(stream).then(results => expect(results).toEqual([value]));
  });

  test(".createReadableOf should create stream of array", () => {
    const value = [1, 2, 3];
    const stream = createReadableOf(value);
    return collect(stream).then(results => expect(results).toEqual([value]));
  });
});

describe(".createReadableFrom", () => {
  test(".createReadableFrom should create stream from iterable", () => {
    const values = [1, 2, 3];
    const stream = createReadableFrom(new Set(values));
    return collect(stream).then(results => expect(results).toEqual(values));
  });
});
