"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eimaInit = eimaInit;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _readline = _interopRequireDefault(require("readline"));

var _ink = require("./ink");

var _util = require("./util");

function eimaInit() {
  var rl = _readline["default"].createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  var options = [];
  (0, _ink.msg)("Please select version of ecma script: es5(require)/es6(import) [es6]");
  var isDone = false;
  rl.on("line", function (line) {
    var input = line;

    if (line.slice() === "/") {
      (0, _ink.err)("THE FIRST SLASH ON THE PATH IS NOT AVAILABLE.");
      process.exit();
    }

    switch (options.length) {
      case 0:
        input = line || "es6";

        if (input === "es6" || input === "es5") {
          options.push(input);
          (0, _ink.msg)("(1/3) Optional || Please enter the asset folder path. [assets]");
          break;
        } else {
          (0, _ink.msg)("Error: Only 2 values(es5/es6) can be received");
          return process.exit();
        }

      case 1:
        input = line || "assets";
        options.push(input);
        (0, _ink.msg)("(2/3) Optional || Please specify the file you want to export. [src/assets.js]");
        break;

      case 2:
        input = line || "src/assets.js";
        options.push(input);
        (0, _ink.msg)("(3/3) Optional || Please specify the asset variable name you want to export. [ASSETS]");
        break;

      case 3:
        input = line || "ASSETS";
        options.push(input);
        var text = "Do you wanna start with the current settings? [Y/N]\n            es ver -------------- ".concat(options[0], "\n            assets -------------- ").concat(options[1], "\n            outPath ------------- ").concat(options[2], "\n            variableName -------- ").concat(options[3], "\n    ");
        (0, _ink.msg)(text);
        break;

      case 4:
        if (line === "Y" || line === "y") {
          isDone = true;
          rl.close();
        } else {
          (0, _ink.err)("Stop setting up");
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
            return _util.createConfigFile.apply(void 0, options);

          case 4:
            (0, _ink.log)("Setup is complete. --> eima start");
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