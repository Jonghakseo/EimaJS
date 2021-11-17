"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eimaInit = eimaInit;
exports.eimaLint = eimaLint;
exports.eimaStart = eimaStart;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _util = require("./util");

var _console = require("./console");

var _constants = require("./constants");

var _assetsToImportFile = require("./assetsToImportFile");

var _readline = _interopRequireDefault(require("readline"));

function eimaInit() {
  var rl = _readline["default"].createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  var options = [];
  (0, _console.msg)("Please select version of ecma script: es5(require)/es6(import) [es6]");
  var isDone = false;
  rl.on("line", function (line) {
    var input = line;

    if (line.slice() === "/") {
      (0, _console.err)("THE FIRST SLASH ON THE PATH IS NOT AVAILABLE.");
      process.exit();
    }

    switch (options.length) {
      case 0:
        input = line || "es6";

        if (input === "es6" || input === "es5") {
          options.push(input);
          (0, _console.msg)("(1/3) Optional || Please enter the asset folder path. [assets]");
          break;
        } else {
          (0, _console.msg)("Error: Only 2 values(es5/es6) can be received");
          return process.exit();
        }

      case 1:
        input = line || "assets";
        options.push(input);
        (0, _console.msg)("(2/3) Optional || Please specify the file you want to export. [src/assets.js]");
        break;

      case 2:
        input = line || "src/assets.js";
        options.push(input);
        (0, _console.msg)("(3/3) Optional || Please specify the asset variable name you want to export. [ASSETS]");
        break;

      case 3:
        input = line || "ASSETS";
        options.push(input);
        var text = "Do you wanna start with the current settings? [Y/N]\n            es ver -------------- ".concat(options[0], "\n            assets -------------- ").concat(options[1], "\n            outPath ------------- ").concat(options[2], "\n            variableName -------- ").concat(options[3], "\n    ");
        (0, _console.msg)(text);
        break;

      case 4:
        if (line === "Y" || line === "y") {
          isDone = true;
          rl.close();
        } else {
          (0, _console.err)("Stop setting up");
          process.exit();
        }

        break;
    }
  }).on("close", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!isDone) {
              _context.next = 10;
              break;
            }

            _context.prev = 1;
            _context.next = 4;
            return _util.makeInitConfigFile.apply(void 0, options);

          case 4:
            (0, _console.log)("Setup is complete. --> eima start");
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](1);
            console.error(_context.t0);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 7]]);
  })));
}

function eimaStart() {
  var configJson = (0, _util.getConfig)();
  var config = configJson || _constants.DEFAULT_CONFIG;

  if (!configJson) {
    (0, _console.msg)("Could not be found or read eima.json. Operate in simple mode.");
  } else {
    (0, _console.log)("eima.json Has been found.");
  }

  if (!(config.target === _constants.ES_VERSION.ES5 || config.target === _constants.ES_VERSION.ES6)) {
    (0, _console.err)("Please check the target ecma script version in eima.json. (es5/es6)");
    process.exit();
  }

  config.paths.forEach(function (path) {
    (0, _assetsToImportFile.assetsToImportFile)(path, config);
  });
}

function eimaLint(_x) {
  return _eimaLint.apply(this, arguments);
}

function _eimaLint() {
  _eimaLint = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(path) {
    var rl;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            rl = _readline["default"].createInterface({
              input: process.stdin,
              output: process.stdout,
              terminal: false
            });
            (0, _console.help)("The Lint Feature Is Experimental And The Results May Not Be Accurate. Do You Still Want To Run It? (Y/N)");
            rl.on("line", function (line) {
              if (line === "Y" || line === "y") {
                assetLint(path);
              } else {
                process.exit();
              }
            });

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _eimaLint.apply(this, arguments);
}

function assetLint(_x2) {
  return _assetLint.apply(this, arguments);
}

function _assetLint() {
  _assetLint = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(path) {
    var config, fileListPromise, importNames, fileLists, filePaths;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            config = (0, _util.getConfig)();

            if (!config || !config.paths.length === 0) {
              (0, _console.err)("Please Check eima.json");
              process.exit();
            }

            if (!config.lintPath && !path) {
              (0, _console.err)("The Lint Feature Requires The Folder Path You Want To Search To. Please Check lintPath in eima.json or -p [path] argument");
              process.exit();
            }

            _context3.next = 5;
            return Promise.all(config.paths.map(function (_ref2) {
              var assets = _ref2.assets;
              return (0, _util.getFileList)(assets, []);
            }));

          case 5:
            fileListPromise = _context3.sent;
            importNames = fileListPromise.flat(Infinity).map(function (_ref3) {
              var name = _ref3.name,
                  ext = _ref3.ext,
                  filePath = _ref3.filePath,
                  size = _ref3.size;
              var constName = name.replace(/[^\w\s]/gim, "_") + "_" + ext.toUpperCase();
              return {
                name: constName,
                filePath: filePath,
                size: size
              };
            });
            _context3.next = 9;
            return (0, _util.getFileListLite)(__dirname, ["".concat(path || config.lintPath)]);

          case 9:
            fileLists = _context3.sent;
            filePaths = fileLists.filter(Boolean).flat(Infinity);
            (0, _util.mergeAllSourceFile)(filePaths, function (stream) {
              var list = "EIMA ASSET LINT(ALPHA)\n\n--LIST OF NON IN-USE ASSETS--\n\n";
              importNames.forEach(function (asset) {
                var name = asset.name,
                    size = asset.size,
                    filePath = asset.filePath;
                var case1 = stream.indexOf(".".concat(name)) === -1;
                var case2 = stream.indexOf("{".concat(name)) === -1;
                var case3 = stream.indexOf("{ ".concat(name)) === -1;
                var case4 = stream.indexOf(" ".concat(name, ",")) === -1;
                var unUsedCase = case1 && case2 && case3 && case4; //사용하지 않는 에셋

                if (unUsedCase) {
                  list += "".concat(name, " ----- ").concat(size, "\n");
                }
              });
              (0, _console.box)(list);
              process.exit();
            });

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _assetLint.apply(this, arguments);
}