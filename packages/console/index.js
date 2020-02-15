const { doWith, toIO } = require("@monadic-node/core");

module.exports = doWith(toIO, console);
