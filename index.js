"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _console = require("./console");

var _react = _interopRequireDefault(require("react"));

var _core = require("./core");

var yargs = require("yargs");

yargs.version("0.1.8");
yargs.command({
  command: "init",
  describe: "Init eima",
  handler: function handler() {
    (0, _core.eimaInit)();
  }
});
yargs.command({
  command: "start",
  describe: "Monitor assets and reflect changes",
  handler: function handler() {
    (0, _core.eimaStart)();
  }
});
yargs.command({
  command: "lint",
  describe: "Check unused asset variables",
  handler: function handler() {
    (0, _core.eimaLint)();
  }
});
yargs.command({
  command: "*",
  handler: function handler() {
    (0, _console.help)("Can't find command --help");
  }
}).demandCommand().argv;