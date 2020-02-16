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

module.exports = {
  collect
};
