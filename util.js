"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkIsFile = checkIsFile;
exports.checkIsFolder = checkIsFolder;
exports.getFileList = getFileList;
exports.makeConfigFile = makeConfigFile;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

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
              // ? 폴더인 경우 재귀 탐색
              if (checkIsFolder(name)) {
                return getFileList(pathname, [].concat((0, _toConsumableArray2["default"])(prefix), [name]));
              } // ? 파일인 경우


              // ? 파일인 경우
              if (checkIsFile(name)) {
                // ? 상수명 (.) dot split
                var CONSTANTS_NAME = name.toUpperCase().split(".")[0]; // ? 확장자

                // ? 확장자
                var ext = _path["default"].extname(name).slice(1); // ? 용량 kb


                // ? 용량 kb
                var unit = "kb";
                var size = Math.round(fs.statSync(_path["default"].resolve(targetPath, name)).size / 1024);

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

function checkIsFolder(fileName) {
  return fileName.indexOf(".") === -1;
}

function checkIsFile(fileName) {
  return fileName.indexOf(".") > 0;
}

function makeConfigFile(_ref) {
  var _ref2 = (0, _slicedToArray2["default"])(_ref, 4),
      target = _ref2[0],
      assets = _ref2[1],
      out = _ref2[2],
      vName = _ref2[3];

  var configJson = {
    target: target,
    hideSize: false,
    paths: [{
      assets: assets,
      out: out,
      vName: vName
    }]
  };

  var savePath = _path["default"].resolve(process.cwd(), "eima.json");

  fs.writeFileSync(savePath, JSON.stringify(configJson));
}