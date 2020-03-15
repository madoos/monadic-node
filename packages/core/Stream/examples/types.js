const Stream = require("../");

const { add, lift, multiply } = require("ramda");

lift(add)(
  Stream.from([1, 2, 3, 4])
    .chain(x => Stream.of(x + 1))
    .concat(Stream.of(5))
    .concat(Stream.empty())
)(
  Stream.from([1, 2, 3, 4])
    .concat(Stream.of(5))
    .concat(Stream.empty())
    .chain(Stream.of)
    .map(multiply(12))
);
// .consume(console.log, console.log, () => console.log("done 1"));

Stream.of(1)
  .chain(one => Stream.of(one + 1))
  .consume(console.log, console.log, () => console.log("done 2"));
