"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ES_VERSION = exports.EIMA_ASSET_EXPORT_FILE = exports.EIMA = exports.DEFAULT_CONFIG = void 0;
// ? ecma script versions
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