"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SIMPLE_MODE = exports.ES_VERSION = exports.EIMA_ASSET_EXPORT_FILE = exports.EIMA = exports.DEFAULT_CONFIG = exports.CONFIG_MODE = void 0;
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
var EIMA = "EIMA";
exports.EIMA = EIMA;
var EIMA_ASSET_EXPORT_FILE = "EIMA ASSET EXPORT FILE";
exports.EIMA_ASSET_EXPORT_FILE = EIMA_ASSET_EXPORT_FILE;
var DEFAULT_CONFIG = {
  paths: [{
    assets: "assets",
    out: "assets.js",
    vName: "ASSETS"
  }],
  lintPath: "src",
  hideSize: true,
  target: ES_VERSION.ES6
};
exports.DEFAULT_CONFIG = DEFAULT_CONFIG;