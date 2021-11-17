"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConfigFile = createConfigFile;
exports.fixEslint = fixEslint;
exports.getConfig = getConfig;
exports.getFileList = getFileList;
exports.getFilePathList = getFilePathList;
exports.getLineInput = getLineInput;
exports.mergeAllSourceFile = mergeAllSourceFile;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util"));

var _readline = _interopRequireDefault(require("readline"));

var _constants = require("./constants");

var _ink = require("./ink");

var _eslint = require("eslint");

function getLineInput(lineCb) {
  var rl = _readline["default"].createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on("line", function (line) {
    rl.close();
    lineCb(line);
  });
} // ? fs의 readDir 메소드를 promisify 하게 wrapping 합니다.


var readdir = _util["default"].promisify(_fs["default"].readdir); // ? file List를 파싱합니다.


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

              var fileStat = _fs["default"].statSync(fullFilePath); // ? 폴더인 경우 재귀 탐색


              // ? 폴더인 경우 재귀 탐색
              if (fileStat.isDirectory()) {
                return getFileList(pathname, [].concat((0, _toConsumableArray2["default"])(prefix), [name]));
              } // ? 파일인 경우


              // ? 파일인 경우
              if (fileStat.isFile()) {
                // ? 상수명 (.) dot split
                var CONSTANTS_NAME = name.toUpperCase().split(".")[0]; // ? 숫자로 시작하는 파일명 캇트

                // ? 숫자로 시작하는 파일명 캇트
                if (CONSTANTS_NAME.substr(0, 1).match(new RegExp("^[0-9]"))) {
                  throw new Error("[".concat(_constants.EIMA, "] A NUMBER CANNOT BE AT THE BEGINNING OF THE FILE NAME."));
                } // ? 확장자


                // ? 확장자
                var ext = _path["default"].extname(name).slice(1); // ? 용량 kb


                // ? 용량 kb
                var unit = "kb";
                var rawSize = fileStat.size;
                var size = Math.round(rawSize / 1024);

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
                    size: "".concat(size).concat(unit),
                    _fullFilePath: fullFilePath,
                    _rawSize: rawSize
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

function getFilePathList(_x3, _x4) {
  return _getFilePathList.apply(this, arguments);
}

function _getFilePathList() {
  _getFilePathList = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(pathname, prefix) {
    var targetPath, fileNames;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            targetPath = prefix ? "".concat(pathname, "/").concat(prefix.join("/")) : pathname;
            _context2.next = 3;
            return readdir(targetPath);

          case 3:
            fileNames = _context2.sent;
            return _context2.abrupt("return", Promise.all(fileNames.map(function (name) {
              var fullFilePath = _path["default"].resolve(targetPath, name);

              var fileStat = _fs["default"].statSync(fullFilePath);

              if (fileStat.isDirectory()) {
                return getFilePathList(pathname, [].concat((0, _toConsumableArray2["default"])(prefix), [name]));
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
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getFilePathList.apply(this, arguments);
}

function createConfigFile(_x5, _x6, _x7, _x8) {
  return _createConfigFile.apply(this, arguments);
}

function _createConfigFile() {
  _createConfigFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(target, assets, out, vName) {
    var configJson, savePath;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            configJson = {
              target: target,
              hideSize: false,
              lintPath: "src",
              paths: [{
                assets: assets,
                out: out,
                vName: vName
              }]
            };
            savePath = _path["default"].resolve(process.cwd(), "eima.json");

            _fs["default"].writeFileSync(savePath, JSON.stringify(configJson));

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _createConfigFile.apply(this, arguments);
}

function fixEslint(_x9) {
  return _fixEslint.apply(this, arguments);
}

function _fixEslint() {
  _fixEslint = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(outPath) {
    var ecmaVersion,
        eslint,
        result,
        _args4 = arguments;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            ecmaVersion = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : 2015;
            eslint = new _eslint.ESLint({
              fix: true,
              overrideConfig: {
                parserOptions: {
                  ecmaVersion: ecmaVersion
                }
              }
            });
            _context4.next = 4;
            return eslint.lintFiles([outPath]);

          case 4:
            result = _context4.sent;
            _context4.next = 7;
            return _eslint.ESLint.outputFixes(result);

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _fixEslint.apply(this, arguments);
}

function mergeAllSourceFile(path, files, cb) {
  var stream = "";
  var count = 0;
  files.forEach(function (fileName) {
    _fs["default"].readFile("".concat(path).concat(fileName), "utf-8", function (err, data) {
      if (err) {
        throw err;
      } else {
        if (data.indexOf(_constants.EIMA_ASSET_EXPORT_FILE) === -1) {
          // 에셋파일 -> 제외
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

function getConfig() {
  var configPath = _path["default"].resolve(process.cwd(), "eima.json");

  var config = null;

  try {
    var configJson = JSON.parse(_fs["default"].readFileSync(configPath, "utf8"));

    if (!configJson.paths || configJson.paths.length === 0) {
      (0, _ink.help)("Please check paths property in eima.json");
    } else {
      config = configJson;
    }
  } catch (e) {
    // config 관련 에러인 경우 ignore
    if (!e.path || !e.path.includes("eima.json")) console.error(e);
  }

  return config;
}