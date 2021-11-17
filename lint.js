"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eimaLint = eimaLint;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _util = require("./util");

var _ink = require("./ink");

var _fs = _interopRequireDefault(require("fs"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function eimaLint(_x) {
  return _eimaLint.apply(this, arguments);
}

function _eimaLint() {
  _eimaLint = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(path) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            (0, _ink.msg)("The Lint Feature Is Experimental And The Results May Not Be Accurate. Do You Still Want To Run It? (Y/N) [N]");
            (0, _util.getLineInput)(function (line) {
              if (line === "Y" || line === "y") {
                assetLint(path);
              } else {
                process.exit();
              }
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _eimaLint.apply(this, arguments);
}

function assetLint(_x2) {
  return _assetLint.apply(this, arguments);
}

function _assetLint() {
  _assetLint = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(path) {
    var config, fileListPromise, importNames, _path, fileLists, filePaths;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            config = (0, _util.getConfig)();

            if (!config || config.paths.length === 0) {
              (0, _ink.err)("Please Check eima.json");
              process.exit();
            }

            if (!config.lintPath && !path) {
              (0, _ink.err)("The Lint Feature Requires The Folder Path You Want To Search To. Please Check lintPath in eima.json or -p [path] argument");
              process.exit();
            }

            _context2.prev = 3;
            _context2.next = 6;
            return Promise.all(config.paths.map(function (_ref) {
              var assets = _ref.assets;
              return (0, _util.getFileList)(assets, []);
            }));

          case 6:
            fileListPromise = _context2.sent;
            importNames = fileListPromise.flat(Infinity).map(function (asset) {
              var name = asset.name,
                  ext = asset.ext;
              var constName = name.replace(/[^\w\s]/gim, "_") + "_" + ext.toUpperCase();
              return _objectSpread(_objectSpread({}, asset), {}, {
                name: constName
              });
            });
            _path = "".concat(_path || config.lintPath);
            _context2.next = 11;
            return (0, _util.getFilePathList)(_path, [""]);

          case 11:
            fileLists = _context2.sent;
            filePaths = fileLists.filter(Boolean).flat(Infinity);
            (0, _util.mergeAllSourceFile)(_path, filePaths, function (stream) {
              var list = "EIMA ASSET LINT(ALPHA)\n\n--LIST OF NON IN-USE ASSETS--\n\n";
              var unUsed = importNames.map(function (asset) {
                var name = asset.name,
                    size = asset.size;
                var case1 = stream.indexOf(".".concat(name)) === -1;
                var case2 = stream.indexOf("{".concat(name)) === -1;
                var case3 = stream.indexOf("{ ".concat(name)) === -1;
                var case4 = stream.indexOf(" ".concat(name, ",")) === -1;
                var unUsedCase = case1 && case2 && case3 && case4; //사용하지 않는 에셋

                if (unUsedCase) {
                  list += "".concat(name, " ----- ").concat(size, "\n");
                  return asset;
                }

                return null;
              }).filter(Boolean);
              (0, _ink.box)(list); // msg("사용하지 않는 파일들을 지우길 원하시나요? (Y/N)");

              (0, _ink.err)("DO YOU WANT TO DELETE UNUSED FILES? (Y/N) [N]");
              var deletedFiles = unUsed.reduce(function (names, _ref2) {
                var _fullFilePath = _ref2._fullFilePath;
                return names.concat(_fullFilePath);
              }, []);
              (0, _ink.box)(deletedFiles.join("\n"));
              (0, _util.getLineInput)(function (line) {
                if (line.toUpperCase() === "Y") {
                  unUsed.forEach(function (_ref3) {
                    var _fullFilePath = _ref3._fullFilePath;
                    return _fs["default"].unlinkSync(_fullFilePath);
                  });
                  (0, _ink.msg)("FILES DELETE COMPLETE");
                  process.exit();
                } else {
                  process.exit();
                }
              });
            });
            _context2.next = 20;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](3);
            console.error(_context2.t0);
            process.exit();

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 16]]);
  }));
  return _assetLint.apply(this, arguments);
}