"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _util = require("./util");

var _console = require("./console");

var _constants = require("./constants");

var _react = _interopRequireDefault(require("react"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _require = require("./console"),
    msg = _require.msg,
    log = _require.log;

var _require2 = require("./assetsToImportFile"),
    assetsToImportFile = _require2.assetsToImportFile;

var fs = require("fs");

var path = require("path");

var yargs = require("yargs");

yargs.version("0.1.8");
yargs.command({
  command: "init",
  describe: "Init eima",
  handler: function handler() {
    // render(<InitialApp />);
    initial();
  }
});
yargs.command({
  command: "start",
  describe: "Monitor assets and reflect changes",
  builder: {
    assets: {
      describe: "assets folder path",
      demandOption: false,
      type: "string"
    },
    out: {
      describe: "assets.js file path",
      demandOption: false,
      type: "string"
    }
  },
  handler: function handler(args) {
    start(args.assets, args.out);
  }
});
yargs.command({
  command: "*",
  handler: function handler() {
    (0, _console.help)("Can't find command --help");
  }
}).demandCommand().argv;

function initial() {
  var readline = require("readline");

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  var options = [];
  msg("Please select version of ecma script: es5(require)/es6(import) [es6]");
  var isDone = false;
  rl.on("line", function (line) {
    var input = line;

    switch (options.length) {
      case 0:
        input = line || "es6";

        if (input === "es6" || input === "es5") {
          options.push(input);
          msg("(1/3) Optional || Please enter the asset folder path. [assets]");
          break;
        } else {
          msg("Error: Only 2 values(es5/es6) can be received");
          return process.exit();
        }

      case 1:
        input = line || "assets";
        options.push(input);
        msg("(2/3) Optional || Please specify the file you want to export. [src/assets.js]");
        break;

      case 2:
        input = line || "src/assets.js";
        options.push(input);
        msg("(3/3) Optional || Please specify the asset variable name you want to export. [ASSETS]");
        break;

      case 3:
        input = line || "ASSETS";
        options.push(input);
        var text = "Do you wanna start with the current settings? [Y/N]\n            es ver -------------- ".concat(options[0], "\n            assets -------------- ").concat(options[1], "\n            outPath ------------- ").concat(options[2], "\n            variableName -------- ").concat(options[3], "\n    ");
        msg(text);
        break;

      case 4:
        if (line === "Y" || line === "y") {
          isDone = true;
          rl.close();
        } else {
          msg("Stop setting up");
          process.exit();
        }

        break;
    }
  }).on("close", function () {
    if (isDone) {
      (0, _util.makeConfigFile)(options);
      log("Setup is complete. --> eima start");
    }
  });
}

function start(assetDirectory, outPath) {
  var assetDir = assetDirectory || "assets";
  var outFile = outPath || "assets.js";
  var configPath = path.resolve(process.cwd(), "eima.json");
  var config = null;
  var mode = _constants.SIMPLE_MODE;

  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    if (!config.paths || config.paths.length === 0) {
      (0, _console.help)("Please check paths property in eima.json");
    } else {
      mode = _constants.CONFIG_MODE;
    }
  } catch (e) {
    // config 관련 에러인 경우 ignore
    if (!e.path || !e.path.includes("eima.json")) console.error(e);
  }

  if (mode === _constants.SIMPLE_MODE) {
    msg("Could not be found or read eima.json. Operate in simple mode.");
    assetsToImportFile({
      assetDir: assetDir,
      outFile: outFile
    });
  }

  if (mode === _constants.CONFIG_MODE) {
    log("eima.json has been found.");

    var _config = _objectSpread({}, config),
        target = _config.target;

    if (target !== _constants.ES_VERSION.ES5 && target !== _constants.ES_VERSION.ES6) {
      (0, _console.help)("Please check the target ecma script version in eima.json. (es5/es6)");
    } else {
      if (!target) {
        config.target = _constants.ES_VERSION.ES6;
      }

      config.paths.forEach(function (_ref) {
        var assets = _ref.assets,
            out = _ref.out,
            vName = _ref.vName;
        assetsToImportFile({
          assetDir: assets,
          outFile: out,
          vName: vName
        }, config);
      });
    }
  }
}