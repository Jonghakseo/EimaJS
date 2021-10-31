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
  return /*#__PURE__*/_react["default"].createElement(_ink.Text, null, /*#__PURE__*/_react["default"].createElement(_ink.Text, {
    color: "yellow"
  }, "[EimaJS] : ".concat(msg)));
};

var Message = function Message(_ref2) {
  var msg = _ref2.msg;
  return /*#__PURE__*/_react["default"].createElement(_ink.Text, null, /*#__PURE__*/_react["default"].createElement(_ink.Text, {
    color: "blue"
  }, "[EimaJS] :"), /*#__PURE__*/_react["default"].createElement(_ink.Text, {
    color: "rgb(43,210,131)"
  }, " ".concat(msg)));
};

function msg() {
  (0, _ink.render)( /*#__PURE__*/_react["default"].createElement(Message, {
    msg: Array.prototype.slice.call(arguments)
  })); // console.info("[EimaJS] :", ...arguments);
}

function help() {
  (0, _ink.render)( /*#__PURE__*/_react["default"].createElement(Help, {
    msg: Array.prototype.slice.call(arguments)
  }));
}

function log() {
  var _console;

  (_console = console).info.apply(_console, ["[EimaJS] :"].concat(Array.prototype.slice.call(arguments)));
}