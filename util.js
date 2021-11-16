"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findVariablesInStream = findVariablesInStream;
exports.getFileList = getFileList;
exports.getFileListLite = getFileListLite;
exports.lint = lint;
exports.makeConfigFile = makeConfigFile;
exports.mergeAllSourceFile = mergeAllSourceFile;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _constants = require("./constants");

var _require = require("eslint"),
    ESLint = _require.ESLint;

var fs = require("fs");

var util = require("util"); // ? fs의 readDir 메소드를 promisify 하게 wrapping 합니다.


var readdir = util.promisify(fs.readdir); // ? file List를 파싱합니다.

function getFileList(_x, _x2) {
  return _getFileList.apply(this, arguments);
}

function _getFileList() {
  _getFileList = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(pathname, prefix) {
    var targetPath, fileNames;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            targetPath = prefix ? "".concat(pathname, "/").concat(prefix.join("/")) : pathname; // ? 찾으려는 폴더 경로의 전체 file Name 긁어옵니다.

            _context.next = 3;
            return readdir(targetPath);

          case 3:
            fileNames = _context.sent;
            return _context.abrupt("return", Promise.all(fileNames.map(function (name) {
              var fullFilePath = _path["default"].resolve(targetPath, name);

              var fileStat = fs.statSync(fullFilePath); // ? 폴더인 경우 재귀 탐색

              // ? 폴더인 경우 재귀 탐색
              if (fileStat.isDirectory()) {
                return getFileList(pathname, [].concat((0, _toConsumableArray2["default"])(prefix), [name]));
              } // ? 파일인 경우


              // ? 파일인 경우
              if (fileStat.isFile()) {
                // ? 상수명 (.) dot split
                var CONSTANTS_NAME = name.toUpperCase().split(".")[0]; // ? 확장자

                // ? 확장자
                var ext = _path["default"].extname(name).slice(1); // ? 용량 kb


                // ? 용량 kb
                var unit = "kb";
                var size = Math.round(fileStat.size / 1024);

                if (size > 1024) {
                  size = Math.round(size / 102.4) / 10;
                  unit = "mb";
                } // ? 상수명 선언


                // ? 상수명 선언
                var filePath = name; // ? prefix(depth)가 없으면 파일명이 곧 경로

                // ? prefix(depth)가 없으면 파일명이 곧 경로
                if (prefix.length > 0) {
                  // ? 그렇지 않으면 경로를 포함해서 상수명 및 경로 수정
                  CONSTANTS_NAME = "".concat(prefix.join("_").toUpperCase(), "_").concat(CONSTANTS_NAME);
                  filePath = "".concat(prefix.join("/"), "/").concat(name);
                } // ? resolve 처리


                // ? resolve 처리
                return new Promise(function (resolve) {
                  resolve({
                    name: CONSTANTS_NAME,
                    ext: ext,
                    filePath: filePath,
                    size: "".concat(size).concat(unit)
                  });
                });
              } else {
                return null;
              }
            })));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getFileList.apply(this, arguments);
}

function makeConfigFile(_x3) {
  return _makeConfigFile.apply(this, arguments);
}

function _makeConfigFile() {
  _makeConfigFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref) {
    var _ref2, target, assets, out, vName, configJson, savePath;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _ref2 = (0, _slicedToArray2["default"])(_ref, 4), target = _ref2[0], assets = _ref2[1], out = _ref2[2], vName = _ref2[3];
            configJson = {
              target: target,
              hideSize: false,
              paths: [{
                assets: assets,
                out: out,
                vName: vName
              }]
            };
            savePath = _path["default"].resolve(process.cwd(), "eima.json");
            fs.writeFileSync(savePath, JSON.stringify(configJson));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _makeConfigFile.apply(this, arguments);
}

function lint(_x4) {
  return _lint.apply(this, arguments);
}

function _lint() {
  _lint = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(outPath) {
    var ecmaVersion,
        eslint,
        result,
        _args3 = arguments;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            ecmaVersion = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 2015;
            eslint = new ESLint({
              fix: true,
              overrideConfig: {
                parserOptions: {
                  ecmaVersion: ecmaVersion
                }
              }
            });
            _context3.next = 4;
            return eslint.lintFiles([outPath]);

          case 4:
            result = _context3.sent;
            _context3.next = 7;
            return ESLint.outputFixes(result);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _lint.apply(this, arguments);
}

function getFileListLite(_x5, _x6) {
  return _getFileListLite.apply(this, arguments);
}

function _getFileListLite() {
  _getFileListLite = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(pathname, prefix) {
    var targetPath, fileNames;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            targetPath = prefix ? "".concat(pathname, "/").concat(prefix.join("/")) : pathname;
            _context4.next = 3;
            return readdir(targetPath);

          case 3:
            fileNames = _context4.sent;
            return _context4.abrupt("return", Promise.all(fileNames.map(function (name) {
              var fullFilePath = _path["default"].resolve(targetPath, name);

              var fileStat = fs.statSync(fullFilePath);

              if (fileStat.isDirectory()) {
                return getFileListLite(pathname, [].concat((0, _toConsumableArray2["default"])(prefix), [name]));
              }

              if (fileStat.isFile()) {
                var filePath = name;

                if (prefix.length > 0) {
                  filePath = "".concat(prefix.join("/"), "/").concat(name);
                }

                return new Promise(function (resolve) {
                  resolve(filePath);
                });
              } else {
                return null;
              }
            })));

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getFileListLite.apply(this, arguments);
}

function mergeAllSourceFile(files, cb) {
  var stream = "";
  var count = 0;
  files.forEach(function (fileName) {
    fs.readFile(fileName, "utf-8", function (err, data) {
      if (err) {
        console.error(err);
      } else {
        console.log(data.indexOf(_constants.EIMA_ASSET_EXPORT_FILE));

        if (data.indexOf(_constants.EIMA_ASSET_EXPORT_FILE) !== -1) {// 에셋파일 -> 제외
        } else {
          stream += data;
        }

        count += 1;

        if (count === files.length) {
          cb(stream);
        }
      }
    });
  });
}

function findVariablesInStream(source) {}