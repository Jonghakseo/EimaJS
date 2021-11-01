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

var _require = require("eslint"),
    ESLint = _require.ESLint;

var fs = require("fs");

var path = require("path");

var _require2 = require("./util"),
    getFileList = _require2.getFileList;

var _require3 = require("./console"),
    log = _require3.log;

function updateAssetsFile(_x) {
  return _updateAssetsFile.apply(this, arguments);
}

function _updateAssetsFile() {
  _updateAssetsFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(baseOption) {
    var basePath, outPath, variableName, pathName, fileList, assetFileInfo, regexp, outPathDepth, depthPrefix, i, assetImportText, assetExportText, assetsTsText, savePath, eslint, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            basePath = baseOption.assetDir, outPath = baseOption.outFile, variableName = baseOption.vName;

            if (!basePath) {
              _context.next = 29;
              break;
            }

            pathName = path.resolve(process.cwd(), basePath);
            _context.prev = 3;
            _context.next = 6;
            return getFileList(pathName, []);

          case 6:
            fileList = _context.sent;
            assetFileInfo = fileList.flat(Infinity).filter(Boolean).map(function (_ref2) {
              var name = _ref2.name,
                  ext = _ref2.ext,
                  filePath = _ref2.filePath;
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

            assetImportText = assetFileInfo.map(function (_ref3) {
              var constName = _ref3.constName,
                  filePath = _ref3.filePath;
              return "import ".concat(constName, " from \"").concat(depthPrefix).concat(basePath, "/").concat(filePath, "\"");
            }).join(";\n") + ";";
            assetExportText = "const ".concat(variableName, " = {\n  ").concat(assetFileInfo.map(function (_ref4) {
              var constName = _ref4.constName;
              return constName;
            }).join(",\n  "), "\n};");
            assetsTsText = assetImportText + "\n\n" + assetExportText + "\n\nexport default ".concat(variableName, ";");
            savePath = path.resolve(process.cwd(), "".concat(outPath));
            fs.writeFileSync(savePath, assetsTsText);
            eslint = new ESLint({
              fix: true,
              plugins: null,
              useEslintrc: false
            });
            _context.next = 20;
            return eslint.lintFiles([outPath]);

          case 20:
            result = _context.sent;
            _context.next = 23;
            return ESLint.outputFixes(result);

          case 23:
            log(basePath, " - 에셋파일이 성공적으로 업데이트 되었습니다." // assetFileInfo
            );
            _context.next = 29;
            break;

          case 26:
            _context.prev = 26;
            _context.t0 = _context["catch"](3);
            console.error(_context.t0);

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 26]]);
  }));
  return _updateAssetsFile.apply(this, arguments);
}

function assetsToImportFile(baseOption, additionalOption) {
  var assetDir = baseOption.assetDir,
      outFile = baseOption.outFile,
      vName = baseOption.vName;

  var _ref = additionalOption || {},
      target = _ref.target;

  if (!assetDir) {
    return (0, _console.help)("asset \uACBD\uB85C\uB97C \uD655\uC778\uD574\uC8FC\uC138\uC694 assetDir: ".concat(assetDir));
  }

  if (!outFile) {
    return (0, _console.help)("out \uACBD\uB85C\uB97C \uD655\uC778\uD574\uC8FC\uC138\uC694 outFile: ".concat(outFile));
  }

  if (!vName) {
    return (0, _console.help)("vName\uC744 \uD655\uC778\uD574\uC8FC\uC138\uC694 vName: ".concat(vName));
  }

  updateAssetsFile(baseOption).then(function () {
    fs.watch(assetDir, {
      recursive: true
    }, function (eventType, fileName) {
      var fName = fileName || "알 수 없음";
      log("\uD30C\uC77C \uBCC0\uACBD \uAC10\uC9C0 [".concat(eventType, " event] - ").concat(fName));
      updateAssetsFile(baseOption)["catch"](function (e) {
        return console.error(e);
      });
    });
  })["catch"](function (e) {
    log("파일 업데이트에서 문제가 발생했습니다.");
    console.error(e);
  });
}