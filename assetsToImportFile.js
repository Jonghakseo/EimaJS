"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assetsToImportFile = assetsToImportFile;
exports.updateAssetsFile = updateAssetsFile;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _console = require("./console");

var _constants = require("./constants");

var _require = require("eslint"),
    ESLint = _require.ESLint;

var fs = require("fs");

var path = require("path");

var _require2 = require("./util"),
    getFileList = _require2.getFileList;

var _require3 = require("./console"),
    log = _require3.log;

function makeAssetFileTextEs6(assetFileInfo, depthPrefix, basePath, variableName) {
  var assetImportText = assetFileInfo.map(function (_ref) {
    var constName = _ref.constName,
        filePath = _ref.filePath;
    return "import ".concat(constName, " from \"").concat(depthPrefix).concat(basePath, "/").concat(filePath, "\"");
  }).join(";\n") + ";";
  var assetExportText = "const ".concat(variableName, " = {\n  ").concat(assetFileInfo.map(function (_ref2) {
    var constName = _ref2.constName;
    return constName;
  }).join(",\n  "), "\n};");
  return assetImportText + "\n\n" + assetExportText + "\n\nexport default ".concat(variableName, ";");
}

function makeAssetFileTextEs5(assetFileInfo, depthPrefix, basePath, variableName) {
  var assetImportText = assetFileInfo.map(function (_ref3) {
    var constName = _ref3.constName,
        filePath = _ref3.filePath;
    return "var ".concat(constName, " = require(\"").concat(depthPrefix).concat(basePath, "/").concat(filePath, "\")");
  }).join(";\n") + ";";
  var assetExportText = "var ".concat(variableName, " = {\n  ").concat(assetFileInfo.map(function (_ref4) {
    var constName = _ref4.constName;
    return constName;
  }).join(",\n  "), "\n};");
  return assetImportText + "\n\n" + assetExportText + "\n\nmodule.exports = ".concat(variableName, ";");
}

function updateAssetsFile(_x, _x2) {
  return _updateAssetsFile.apply(this, arguments);
}

function _updateAssetsFile() {
  _updateAssetsFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(baseOption, config) {
    var basePath, outPath, variableName, target, pathName, fileList, assetFileInfo, regexp, outPathDepth, depthPrefix, i, assetsTsText, savePath, ecmaVersion, eslint, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            basePath = baseOption.assetDir, outPath = baseOption.outFile, variableName = baseOption.vName;
            target = config.target;

            if (!basePath) {
              _context.next = 32;
              break;
            }

            pathName = path.resolve(process.cwd(), basePath);
            _context.prev = 4;
            log("GETTING LIST OF FILES...");
            _context.next = 8;
            return getFileList(pathName, []);

          case 8:
            fileList = _context.sent;
            assetFileInfo = fileList.flat(Infinity).filter(Boolean).map(function (_ref5) {
              var name = _ref5.name,
                  ext = _ref5.ext,
                  filePath = _ref5.filePath;
              var constName = name.replace(/[^\w\s]/gim, "_") + "_" + ext.toUpperCase();
              return {
                constName: constName,
                filePath: filePath
              };
            });
            regexp = new RegExp("/", "g");
            outPathDepth = Array.from(outPath.matchAll(regexp)).length;
            depthPrefix = "";

            for (i = 0; i < outPathDepth; i++) {
              depthPrefix += "../";
            }

            if (target === _constants.ES_VERSION.ES5) {
              assetsTsText = makeAssetFileTextEs5(assetFileInfo, depthPrefix, basePath, variableName);
            } else {
              assetsTsText = makeAssetFileTextEs6(assetFileInfo, depthPrefix, basePath, variableName);
            }

            savePath = path.resolve(process.cwd(), "".concat(outPath));
            log("CREATING ASSET IMPORT FILE...");
            fs.writeFileSync(savePath, assetsTsText);
            ecmaVersion = target === _constants.ES_VERSION.ES5 ? 3 : 2015;
            eslint = new ESLint({
              fix: true,
              overrideConfig: {
                parserOptions: {
                  ecmaVersion: ecmaVersion
                }
              }
            });
            _context.next = 22;
            return eslint.lintFiles([outPath]);

          case 22:
            result = _context.sent;
            log("RUNNING ESLINT...");
            _context.next = 26;
            return ESLint.outputFixes(result);

          case 26:
            log(basePath, " - ASSETFILE HAS BEEN SUCCESSFULLY UPDATED." // assetFileInfo
            );
            _context.next = 32;
            break;

          case 29:
            _context.prev = 29;
            _context.t0 = _context["catch"](4);
            console.error(_context.t0);

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 29]]);
  }));
  return _updateAssetsFile.apply(this, arguments);
}

function assetsToImportFile(baseOption, config) {
  var assetDir = baseOption.assetDir,
      outFile = baseOption.outFile,
      vName = baseOption.vName; // const { target } = config || {};

  if (!assetDir) {
    return (0, _console.help)("PLEASE CHECK THE ASSET PATH. assetDir: ".concat(assetDir));
  }

  if (!outFile) {
    return (0, _console.help)("PLEASE CHECK THE OUTFILE. outFile: ".concat(outFile));
  }

  if (!vName) {
    return (0, _console.help)("PLEASE CHECK THE VARIABLE NAME. vName: ".concat(vName));
  }

  updateAssetsFile(baseOption, config).then(function () {
    fs.watch(assetDir, {
      recursive: true
    }, function (eventType, fileName) {
      var fName = fileName || "_UNKNOWN_";
      log("DETECT FILE CHANGES [".concat(eventType, " EVENT] - ").concat(fName));
      updateAssetsFile(baseOption, config)["catch"](function (e) {
        return console.error(e);
      });
    });
  })["catch"](function (e) {
    log("THERE WAS A PROBLEM UPDATING THE FILE.");
    console.error(e);
  });
}