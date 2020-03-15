const { apply } = require("ramda");
const equals = require("deep-equal");

// collect :: (Stream a| Monstream a) -> Promise e [a]
const collect = stream => {
  const results = [];
  return new Promise((resolve, reject) => {
    const pushResults = val => results.push(val);
    const resolveResults = () => resolve(results);
    return stream.consume
      ? stream.consume(pushResults, reject, resolveResults)
      : stream
          .on("data", pushResults)
          .on("end", resolveResults)
          .on("error", reject);
  });
};

const isEquivalent = (x, y) =>
  Promise.all([collect(x), collect(y)]).then(apply(equals));

module.exports = {
  collect,
  isEquivalent
};
