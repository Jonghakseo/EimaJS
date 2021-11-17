"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assetLint = assetLint;
exports.getConfig = getConfig;
exports.getFileList = getFileList;
exports.getFileListLite = getFileListLite;
exports.makeInitConfigFile = makeInitConfigFile;
exports.mergeAllSourceFile = mergeAllSourceFile;
exports.runEslint = runEslint;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path2 = _interopRequireDefault(require("path"));

var _constants = require("./constants");

var _console = require("./console");

var _require = require("eslint"),
    ESLint = _require.ESLint;

var fs = require("fs");

var util = require("util");

var hashCode = function hashCode(s) {
  return s.split("").reduce(function (a, b) {
    return (a << 5) - a + b.charCodeAt(0) | 0;
  }, 0);
}; // ? fs의 readDir 메소드를 promisify 하게 wrapping 합니다.


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
              var fullFilePath = _path2["default"].resolve(targetPath, name);

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
                var ext = _path2["default"].extname(name).slice(1); // ? 용량 kb


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
                    rawSize: rawSize
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

function getFileListLite(_x3, _x4) {
  return _getFileListLite.apply(this, arguments);
}

function _getFileListLite() {
  _getFileListLite = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(pathname, prefix) {
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
              var fullFilePath = _path2["default"].resolve(targetPath, name);

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
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getFileListLite.apply(this, arguments);
}

function makeInitConfigFile(_x5, _x6, _x7, _x8) {
  return _makeInitConfigFile.apply(this, arguments);
}

function _makeInitConfigFile() {
  _makeInitConfigFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(target, assets, out, vName) {
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
            savePath = _path2["default"].resolve(process.cwd(), "eima.json");
            fs.writeFileSync(savePath, JSON.stringify(configJson));

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _makeInitConfigFile.apply(this, arguments);
}

function runEslint(_x9) {
  return _runEslint.apply(this, arguments);
}

function _runEslint() {
  _runEslint = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(outPath) {
    var ecmaVersion,
        eslint,
        result,
        _args4 = arguments;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            ecmaVersion = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : 2015;
            eslint = new ESLint({
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
            return ESLint.outputFixes(result);

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _runEslint.apply(this, arguments);
}

function mergeAllSourceFile(path, files, cb) {
  var stream = "";
  var count = 0;
  files.forEach(function (fileName) {
    fs.readFile("".concat(path).concat(fileName), "utf-8", function (err, data) {
      if (err) {
        console.error(err);
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
  var configPath = _path2["default"].resolve(process.cwd(), "eima.json");

  var config = null;

  try {
    var configJson = JSON.parse(fs.readFileSync(configPath, "utf8"));

    if (!configJson.paths || configJson.paths.length === 0) {
      (0, _console.help)("Please check paths property in eima.json");
    } else {
      config = configJson;
    }
  } catch (e) {
    // config 관련 에러인 경우 ignore
    if (!e.path || !e.path.includes("eima.json")) console.error(e);
  }

  return config;
}

function assetLint(_x10) {
  return _assetLint.apply(this, arguments);
}

function _assetLint() {
  _assetLint = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(path) {
    var config, fileListPromise, importNames, _path, fileLists, filePaths;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            config = getConfig();

            if (!config || config.paths.length === 0) {
              (0, _console.err)("Please Check eima.json");
              process.exit();
            }

            if (!config.lintPath && !path) {
              (0, _console.err)("The Lint Feature Requires The Folder Path You Want To Search To. Please Check lintPath in eima.json or -p [path] argument");
              process.exit();
            }

            _context5.prev = 3;
            _context5.next = 6;
            return Promise.all(config.paths.map(function (_ref) {
              var assets = _ref.assets;
              return getFileList(assets, []);
            }));

          case 6:
            fileListPromise = _context5.sent;
            importNames = fileListPromise.flat(Infinity).map(function (_ref2) {
              var name = _ref2.name,
                  ext = _ref2.ext,
                  filePath = _ref2.filePath,
                  size = _ref2.size,
                  rawSize = _ref2.rawSize;
              var constName = name.replace(/[^\w\s]/gim, "_") + "_" + ext.toUpperCase();
              var hash = hashCode(name, ext, filePath, rawSize);
              return {
                name: constName,
                filePath: filePath,
                size: size,
                hash: hash,
                rawSize: rawSize
              };
            });
            _path = "".concat(_path || config.lintPath);
            _context5.next = 11;
            return getFileListLite(_path, [""]);

          case 11:
            fileLists = _context5.sent;
            filePaths = fileLists.filter(Boolean).flat(Infinity);
            mergeAllSourceFile(_path, filePaths, function (stream) {
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
              (0, _console.box)(list); // msg("사용하지 않는 파일들을 지우길 원하시나요?");
              // console.log(unUsed);

              process.exit();
            });
            _context5.next = 20;
            break;

          case 16:
            _context5.prev = 16;
            _context5.t0 = _context5["catch"](3);
            console.error(_context5.t0);
            process.exit();

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 16]]);
  }));
  return _assetLint.apply(this, arguments);
}