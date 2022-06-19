"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = exports.EIMA_ASSET_EXPORT_FILE = exports.EIMA = exports.VARIABLE_CASING = exports.TOTAL_STEP = exports.ES_VERSION = void 0;
// ? ecma script versions
exports.ES_VERSION = {
    ES5: "es5",
    ES6: "es6",
};
exports.TOTAL_STEP = 5;
exports.VARIABLE_CASING = [
    "Camel",
    "Snake",
    "Pascal",
    "Upper with snake", //
];
exports.EIMA = "EIMA";
exports.EIMA_ASSET_EXPORT_FILE = "EIMA ASSET EXPORT FILE";
exports.DEFAULT_CONFIG = {
    paths: [
        {
            assets: "assets",
            out: "assets.js",
            vName: "ASSETS",
        },
    ],
    lintPath: "src",
    hideSize: true,
    target: exports.ES_VERSION.ES6,
};
