"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _console = require("./console");

var _react = _interopRequireDefault(require("react"));

var _core = require("./core");

var yargs = require("yargs");

yargs.help("help").alias("h", "help");
yargs.version("0.2.0").alias("v", "version");
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
  desc: "Check unused asset variables. Use with -p ${target path}",
  builder: {
    path: {
      alias: "p",
      desc: "Lint target path",
      nargs: 1,
      type: "string"
    }
  },
  handler: function handler(args) {
    (0, _core.eimaLint)(args.path);
  }
});
yargs.command({
  command: "*",
  handler: function handler() {
    (0, _console.help)("No Commands Found.");
    yargs.showHelp();
  }
}).demandCommand().argv;