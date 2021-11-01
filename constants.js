"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SIMPLE_MODE = exports.ES_VERSION = exports.CONFIG_MODE = void 0;
// ? simple mode - 한 개의 에셋 폴더, 한 개의 import file
// ? config mode - 한 개 이상의 에셋 폴더, 한 개 이상의 import file
var SIMPLE_MODE = "SIMPLE";
exports.SIMPLE_MODE = SIMPLE_MODE;
var CONFIG_MODE = "CONFIG"; // ? ecma script versions

exports.CONFIG_MODE = CONFIG_MODE;
var ES_VERSION = {
  ES5: "es5",
  ES6: "es6"
};
exports.ES_VERSION = ES_VERSION;