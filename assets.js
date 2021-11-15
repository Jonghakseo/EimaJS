"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sample = _interopRequireDefault(require("../test/assets/png/sample.png"));

var _sample2 = _interopRequireDefault(require("../test/assets/sample.png"));

var _sample2x = _interopRequireDefault(require("../test/assets/sample@2x.png"));

var others = {
  PNG_SAMPLE_PNG: _sample["default"],
  SAMPLE_PNG: _sample2["default"],
  SAMPLE_2X_PNG: _sample2x["default"]
};
var _default = others;
exports["default"] = _default;