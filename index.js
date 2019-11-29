"use strict";

const path = require("path");

module.exports.rustyWindPath = path.join(
  __dirname,
  `rustywind${process.platform === "win32" ? ".exe" : ""}`
);
