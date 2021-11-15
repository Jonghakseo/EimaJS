"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = help;
exports.log = log;
exports.msg = msg;

var _react = _interopRequireDefault(require("react"));

var _ink = require("ink");

var Help = function Help(_ref) {
  var msg = _ref.msg;
  return /*#__PURE__*/_react["default"].createElement(_ink.Static, {
    items: ["1"]
  }, function (value) {
    return /*#__PURE__*/_react["default"].createElement(_ink.Box, {
      key: value
    }, /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "yellow"
    }, "[EIMA] : ".concat(msg)));
  });
};

var Message = function Message(_ref2) {
  var msg = _ref2.msg;
  return /*#__PURE__*/_react["default"].createElement(_ink.Static, {
    items: ["2"]
  }, function (value) {
    return /*#__PURE__*/_react["default"].createElement(_ink.Box, {
      key: value
    }, /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "blue"
    }, "[EimaJS] :"), /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "rgb(43,210,131)"
    }, " ".concat(msg)));
  });
};

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

function log() {
  var _console;

  (_console = console).info.apply(_console, ["[EIMA] :"].concat(Array.prototype.slice.call(arguments)));
}