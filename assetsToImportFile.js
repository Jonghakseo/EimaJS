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

function makeAssetFileText(material) {
  var target = material.config.target;

  if (target === _constants.ES_VERSION.ES5) {
    return makeAssetFileTextEs5(material);
  }

  if (target === _constants.ES_VERSION.ES6) {
    return makeAssetFileTextEs6(material);
  }
}

function makeAssetFileTextEs6(_ref) {
  var config = _ref.config,
      assetFileInfo = _ref.assetFileInfo,
      depthPrefix = _ref.depthPrefix,
      basePath = _ref.basePath,
      variableName = _ref.variableName;
  var hideSize = config.hideSize;
  var assetImportText = assetFileInfo.map(function (_ref2) {
    var constName = _ref2.constName,
        filePath = _ref2.filePath,
        size = _ref2.size;
    var sizeComment = hideSize ? "" : "// ".concat(size);
    return "import ".concat(constName, " from \"").concat(depthPrefix).concat(basePath, "/").concat(filePath, "\"; ").concat(sizeComment);
  }).join("\n");
  var assetExportText = "const ".concat(variableName, " = {\n  ").concat(assetFileInfo.map(function (_ref3) {
    var constName = _ref3.constName;
    return constName;
  }).join(",\n  "), "\n};");
  return assetImportText + "\n\n" + assetExportText + "\n\nexport default ".concat(variableName, ";");
}

function makeAssetFileTextEs5(_ref4) {
  var config = _ref4.config,
      assetFileInfo = _ref4.assetFileInfo,
      depthPrefix = _ref4.depthPrefix,
      basePath = _ref4.basePath,
      variableName = _ref4.variableName;
  var hideSize = config.hideSize;
  var assetImportText = assetFileInfo.map(function (_ref5) {
    var constName = _ref5.constName,
        filePath = _ref5.filePath,
        size = _ref5.size;
    var sizeComment = hideSize ? "" : "// ".concat(size);
    return "var ".concat(constName, " = require(\"").concat(depthPrefix).concat(basePath, "/").concat(filePath, "\"); ").concat(sizeComment);
  }).join("\n");
  var assetExportText = "var ".concat(variableName, " = {\n  ").concat(assetFileInfo.map(function (_ref6) {
    var constName = _ref6.constName;
    return constName;
  }).join(",\n  "), "\n};");
  return assetImportText + "\n\n" + assetExportText + "\n\nmodule.exports = ".concat(variableName, ";");
}

function updateAssetsFile(_x, _x2) {
  return _updateAssetsFile.apply(this, arguments);
}

function _updateAssetsFile() {
  _updateAssetsFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(baseOption, config) {
    var basePath, outPath, variableName, target, pathName, fileList, assetFileInfo, regexp, outPathDepth, depthPrefix, i, material, assetsTsText, savePath, ecmaVersion, eslint, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            basePath = baseOption.assetDir, outPath = baseOption.outFile, variableName = baseOption.vName;
            target = config.target;
            pathName = path.resolve(process.cwd(), basePath); // ? 파일 목록 재귀로 가져옴

            log("GETTING LIST OF FILES...");
            _context.next = 6;
            return getFileList(pathName, []);

          case 6:
            fileList = _context.sent;
            assetFileInfo = fileList.filter(Boolean).flat(Infinity).map(function (_ref7) {
              var name = _ref7.name,
                  ext = _ref7.ext,
                  filePath = _ref7.filePath,
                  size = _ref7.size;
              // console.log(name, ext, filePath, size);
              var constName = name.replace(/[^\w\s]/gim, "_") + "_" + ext.toUpperCase();
              return {
                constName: constName,
                filePath: filePath,
                size: size
              };
            });
            regexp = new RegExp("/", "g");
            outPathDepth = Array.from(outPath.matchAll(regexp)).length;
            depthPrefix = "";

            for (i = 0; i < outPathDepth; i++) {
              depthPrefix += "../";
            }

            material = {
              config: config,
              assetFileInfo: assetFileInfo,
              depthPrefix: depthPrefix,
              basePath: basePath,
              variableName: variableName
            };
            assetsTsText = makeAssetFileText(material);
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
            log("RUNNING ESLINT...");
            _context.next = 22;
            return eslint.lintFiles([outPath]);

          case 22:
            result = _context.sent;
            _context.next = 25;
            return ESLint.outputFixes(result);

          case 25:
            log("".concat(basePath, " - ASSETFILE HAS BEEN SUCCESSFULLY UPDATED."));

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
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