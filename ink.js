"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.box = box;
exports.err = err;
exports.help = help;
exports.log = log;
exports.msg = msg;

var _react = _interopRequireDefault(require("react"));

var _ink = require("ink");

var _constants = require("./constants");

var Help = function Help(_ref) {
  var msg = _ref.msg;
  return /*#__PURE__*/_react["default"].createElement(_ink.Static, {
    items: ["help"]
  }, function (value) {
    return /*#__PURE__*/_react["default"].createElement(_ink.Box, {
      key: value
    }, /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "cyanBright"
    }, "[", _constants.EIMA, "] :"), /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "yellow",
      dimColor: true
    }, " ".concat(msg)));
  });
};

var Error = function Error(_ref2) {
  var msg = _ref2.msg;
  return /*#__PURE__*/_react["default"].createElement(_ink.Static, {
    items: ["error"]
  }, function (value) {
    return /*#__PURE__*/_react["default"].createElement(_ink.Box, {
      key: value
    }, /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "cyanBright"
    }, "[", _constants.EIMA, "] :"), /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "red",
      dimColor: true
    }, " ".concat(msg)));
  });
};

var Message = function Message(_ref3) {
  var msg = _ref3.msg;
  return /*#__PURE__*/_react["default"].createElement(_ink.Static, {
    items: ["msg"]
  }, function (value) {
    return /*#__PURE__*/_react["default"].createElement(_ink.Box, {
      key: value
    }, /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "cyanBright"
    }, "[", _constants.EIMA, "] : "), /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "rgb(43,210,131)"
    }, "".concat(msg)));
  });
};

var BoxMessage = function BoxMessage(_ref4) {
  var msg = _ref4.msg;
  return /*#__PURE__*/_react["default"].createElement(_ink.Static, {
    items: ["box"]
  }, function (value) {
    return /*#__PURE__*/_react["default"].createElement(_ink.Box, {
      key: value,
      borderStyle: "double",
      paddingX: 2
    }, /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "rgb(43,210,131)"
    }, "".concat(msg)));
  });
};

var Log = function Log(_ref5) {
  var msg = _ref5.msg;
  return /*#__PURE__*/_react["default"].createElement(_ink.Static, {
    items: ["log"]
  }, function (value) {
    return /*#__PURE__*/_react["default"].createElement(_ink.Box, {
      key: value
    }, /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "cyanBright"
    }, "[", _constants.EIMA, "] :"), /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "yellow",
      dimColor: true
    }, " ".concat(msg)));
  });
};

function box() {
  (0, _ink.render)( /*#__PURE__*/_react["default"].createElement(BoxMessage, {
    msg: Array.prototype.slice.call(arguments)
  })).cleanup();
}

function msg() {
  (0, _ink.render)( /*#__PURE__*/_react["default"].createElement(Message, {
    msg: Array.prototype.slice.call(arguments)
  })).cleanup();
}

function help() {
  (0, _ink.render)( /*#__PURE__*/_react["default"].createElement(Help, {
    msg: Array.prototype.slice.call(arguments)
  })).cleanup();
}

function err() {
  (0, _ink.render)( /*#__PURE__*/_react["default"].createElement(Error, {
    msg: Array.prototype.slice.call(arguments)
  })).cleanup();
}

function log() {
  (0, _ink.render)( /*#__PURE__*/_react["default"].createElement(Log, {
    msg: Array.prototype.slice.call(arguments)
  })).cleanup();
}