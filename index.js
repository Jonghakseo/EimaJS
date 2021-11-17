"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _yargs = _interopRequireDefault(require("yargs"));

var _ink = require("./ink");

var _init = require("./init");

var _start = require("./start");

var _lint = require("./lint");

_yargs["default"].help("help").alias("h", "help");

_yargs["default"].version("0.2.0").alias("v", "version");

_yargs["default"].command({
  command: "init",
  describe: "Init eima",
  handler: function handler() {
    (0, _init.eimaInit)();
  }
});

_yargs["default"].command({
  command: "start",
  describe: "Monitor assets and reflect changes",
  handler: function handler() {
    (0, _start.eimaStart)();
  }
});

_yargs["default"].command({
  command: "lint",
  describe: "Check unused asset variables. Use with -p ${target path}",
  builder: {
    path: {
      alias: "p",
      desc: "Lint target path",
      nargs: 1,
      type: "string"
    }
  },
  handler: function handler(_ref) {
    var path = _ref.path;
    void (0, _lint.eimaLint)(path);
  }
});

_yargs["default"].command({
  command: "*",
  handler: function handler() {
    (0, _ink.help)("No Commands Found.");

    _yargs["default"].showHelp();
  }
}).demandCommand().argv;