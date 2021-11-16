"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assetsToImportFile = assetsToImportFile;
exports.updateAssetsFile = updateAssetsFile;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _console = require("./console");

var _constants = require("./constants");

var _util = require("./util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var fs = require("fs");

var path = require("path");

var _require = require("./util"),
    getFileList = _require.getFileList;

var _require2 = require("./console"),
    log = _require2.log;

function makeAssetFileText(material) {
  var target = material.config.target;
  var prefix = "// ".concat(_constants.EIMA_ASSET_EXPORT_FILE, "\n");
  var assetText = "";

  if (target === _constants.ES_VERSION.ES5) {
    assetText = makeAssetFileTextEs5(material);
  }

  if (target === _constants.ES_VERSION.ES6) {
    assetText = makeAssetFileTextEs6(material);
  }

  return prefix + assetText;
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

function updateAssetsFile(_x) {
  return _updateAssetsFile.apply(this, arguments);
}

function _updateAssetsFile() {
  _updateAssetsFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(pathAndConfig) {
    var basePath, outPath, variableName, target, pathName, fileList, assetFileInfo, regexp, outPathDepth, depthPrefix, i, material, assetsTsText, savePath, ecmaVersion;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            basePath = pathAndConfig.assets, outPath = pathAndConfig.out, variableName = pathAndConfig.vName, target = pathAndConfig.target;
            pathName = path.resolve(process.cwd(), basePath); // ? 파일 목록 재귀로 가져옴

            log("GETTING LIST OF FILES...");
            _context.next = 5;
            return getFileList(pathName, []);

          case 5:
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
              config: pathAndConfig,
              assetFileInfo: assetFileInfo,
              depthPrefix: depthPrefix,
              basePath: basePath,
              variableName: variableName
            };
            assetsTsText = makeAssetFileText(material);
            log("CREATING ASSET IMPORT FILE...");
            savePath = path.resolve(process.cwd(), "".concat(outPath));
            fs.writeFileSync(savePath, assetsTsText);
            log("RUNNING ESLINT...");
            ecmaVersion = target === _constants.ES_VERSION.ES5 ? 3 : 2015;
            _context.next = 20;
            return (0, _util.runEslint)(outPath, ecmaVersion);

          case 20:
            log("".concat(basePath, " - ASSETFILE HAS BEEN SUCCESSFULLY UPDATED."));

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _updateAssetsFile.apply(this, arguments);
}

function assetsToImportFile(path, config) {
  var assets = path.assets,
      out = path.out,
      vName = path.vName;

  if (!assets) {
    return (0, _console.help)("PLEASE CHECK THE ASSET PATH. assets: ".concat(assets));
  }

  if (!out) {
    return (0, _console.help)("PLEASE CHECK THE OUTFILE. out: ".concat(out));
  }

  if (!vName) {
    return (0, _console.help)("PLEASE CHECK THE VARIABLE NAME. vName: ".concat(vName));
  }

  updateAssetsFile(_objectSpread(_objectSpread({}, path), config)).then(function () {
    fs.watch(assets, {
      recursive: true
    }, function (eventType, fileName) {
      var fName = fileName || "_UNKNOWN_";
      log("DETECT FILE CHANGES [".concat(eventType, " EVENT] - ").concat(fName));
      updateAssetsFile(_objectSpread(_objectSpread({}, path), config))["catch"](function (e) {
        return console.error(e);
      });
    });
  })["catch"](function (e) {
    log("THERE WAS A PROBLEM UPDATING THE FILE.");
    console.error(e);
  });
}