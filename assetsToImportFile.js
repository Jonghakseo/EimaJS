"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assetsToImportFile = assetsToImportFile;
exports.updateAssetsFile = updateAssetsFile;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var fs = require("fs");

var path = require("path");

var _require = require("./util"),
    getFileList = _require.getFileList,
    msg = _require.msg;

function updateAssetsFile(_x, _x2, _x3) {
  return _updateAssetsFile.apply(this, arguments);
}

function _updateAssetsFile() {
  _updateAssetsFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(basePath, outPath, variableName) {
    var pathName, fileList, assetFileInfo, regexp, outPathDepth, depthPrefix, i, assetImportText, assetExportText, assetsTsText, savePath;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!basePath) {
              _context.next = 22;
              break;
            }

            pathName = path.resolve(process.cwd(), basePath);
            _context.prev = 2;
            _context.next = 5;
            return getFileList(pathName, []);

          case 5:
            fileList = _context.sent;
            assetFileInfo = fileList.flat(Infinity).filter(Boolean).map(function (_ref2) {
              var name = _ref2.name,
                  filePath = _ref2.filePath;
              var underBar = /-/gi;
              var constName = name.replace(underBar, "_");
              return {
                constName: constName,
                filePath: filePath
              };
            });
            regexp = new RegExp('\/', 'g');
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
            msg(basePath, "에셋파일이 성공적으로 업데이트 되었습니다.\n", assetFileInfo);
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](2);
            console.error(_context.t0);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 19]]);
  }));
  return _updateAssetsFile.apply(this, arguments);
}

function assetsToImportFile(baseOption, additionalOption) {
  var assetDir = baseOption.assetDir,
      outFile = baseOption.outFile,
      vName = baseOption.vName;

  var _ref = additionalOption || {},
      target = _ref.target;

  console.log(target);

  if (!assetDir) {
    return msg("asset 경로를 확인해주세요 assetDir:", assetDir);
  }

  if (!outFile) {
    return msg("out 경로를 확인해주세요 outFile:", outFile);
  }

  var variableName = vName || "ASSETS";
  updateAssetsFile(assetDir, outFile, variableName).then(function () {
    fs.watch(assetDir, {
      recursive: true
    }, function (eventType, fileName) {
      msg(eventType, fileName || "알 수 없음");
      updateAssetsFile(assetDir, outFile, variableName)["catch"](function (e) {
        return console.error(e);
      });
    });
  })["catch"](function (e) {
    msg("파일 업데이트에서 문제가 발생했습니다.");
    console.error(e);
  });
}