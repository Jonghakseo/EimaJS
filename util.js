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

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var fs = require("fs");

var util = require("util"); // fs의 readDir 메소드를 promisify 하게 wrapping 합니다.


var readdir = util.promisify(fs.readdir); // file List를 파싱합니다.

function getFileList(_x, _x2) {
  return _getFileList.apply(this, arguments);
}

function _getFileList() {
  _getFileList = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(pathname, prefix) {
    var fileNames;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return readdir(prefix ? "".concat(pathname, "/").concat(prefix.join("/")) : pathname);

          case 2:
            fileNames = _context.sent;
            return _context.abrupt("return", Promise.all(fileNames.map(function (name) {
              if (checkIsFolder(name)) {
                // 폴더인 경우 재귀 탐색
                return getFileList(pathname, [].concat((0, _toConsumableArray2["default"])(prefix), [name]));
              }

              if (checkIsFile(name)) {
                // 파일인 경우
                var CONSTANTS_NAME = name.toUpperCase().split(".")[0]; // 상수명 선언

                // 상수명 선언
                var filePath = name; // prefix(depth)가 없으면 파일명이 곧 경로

                // prefix(depth)가 없으면 파일명이 곧 경로
                if (prefix.length > 0) {
                  // 그렇지 않으면 경로를 포함해서 상수명 및 경로 수정
                  CONSTANTS_NAME = "".concat(prefix.join("_").toUpperCase(), "_").concat(CONSTANTS_NAME);
                  filePath = "".concat(prefix.join("/"), "/").concat(name);
                } // resolve 처리


                // resolve 처리
                return new Promise(function (resolve) {
                  resolve({
                    name: CONSTANTS_NAME,
                    filePath: filePath
                  });
                });
              } else {
                return null;
              }
            })));

          case 4:
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

function makeConfigFile(baseConfigArray) {
  var configJson = {
    paths: [{
      assets: baseConfigArray[0],
      out: baseConfigArray[1],
      vName: baseConfigArray[2]
    }]
  };

  var savePath = _path["default"].resolve(process.cwd(), "eima.json");

  fs.writeFileSync(savePath, JSON.stringify(configJson));
}