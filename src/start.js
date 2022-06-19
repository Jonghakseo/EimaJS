#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eimaStart = void 0;
// import * as chalk from "chalk";
var fs = require("fs");
var path = require("path");
var util_1 = require("./util");
var constants_1 = require("./constants");
var util_js_1 = require("./util.js");
function eimaStart() {
    var configJson = (0, util_1.getConfig)();
    var config = configJson || constants_1.DEFAULT_CONFIG;
    if (!configJson) {
        (0, util_js_1.help)("Could not be found or read eima.json. Operate in simple mode.");
    }
    else {
        (0, util_js_1.help)("eima.json Has been found.");
    }
    if (!(config.target === constants_1.ES_VERSION.ES5 || config.target === constants_1.ES_VERSION.ES6)) {
        (0, util_js_1.err)("Please check the target ecma script version in eima.json. (es5/es6)");
        process.exit();
    }
    config.paths.forEach(function (path) {
        void assetsToImportFile(path, config);
    });
}
exports.eimaStart = eimaStart;
function makeAssetFileText(material) {
    var target = material.config.target;
    var prefix = "// ".concat(constants_1.EIMA_ASSET_EXPORT_FILE, "\n");
    var assetText = "";
    if (target === constants_1.ES_VERSION.ES5) {
        assetText = makeAssetFileTextEs5(material);
    }
    if (target === constants_1.ES_VERSION.ES6) {
        assetText = makeAssetFileTextEs6(material);
    }
    return prefix + assetText;
}
function makeAssetFileTextEs6(_a) {
    var config = _a.config, assetFileInfo = _a.assetFileInfo, depthPrefix = _a.depthPrefix, basePath = _a.basePath, variableName = _a.variableName;
    var hideSize = config.hideSize;
    var assetImportText = assetFileInfo
        .map(function (_a) {
        var constName = _a.constName, filePath = _a.filePath, size = _a.size;
        var sizeComment = hideSize ? "" : "// ".concat(size);
        return "import ".concat(constName, " from \"").concat(depthPrefix).concat(basePath, "/").concat(filePath, "\"; ").concat(sizeComment);
    })
        .join("\n");
    var assetExportText = "const ".concat(variableName, " = {\n  ").concat(assetFileInfo
        .map(function (_a) {
        var constName = _a.constName;
        return constName;
    })
        .join(",\n  "), "\n};");
    return (assetImportText +
        "\n\n" +
        assetExportText +
        "\n\nexport default ".concat(variableName, ";"));
}
function makeAssetFileTextEs5(_a) {
    var config = _a.config, assetFileInfo = _a.assetFileInfo, depthPrefix = _a.depthPrefix, basePath = _a.basePath, variableName = _a.variableName;
    var hideSize = config.hideSize;
    var assetImportText = assetFileInfo
        .map(function (_a) {
        var constName = _a.constName, filePath = _a.filePath, size = _a.size;
        var sizeComment = hideSize ? "" : "// ".concat(size);
        return "var ".concat(constName, " = require(\"").concat(depthPrefix).concat(basePath, "/").concat(filePath, "\"); ").concat(sizeComment);
    })
        .join("\n");
    var assetExportText = "var ".concat(variableName, " = {\n  ").concat(assetFileInfo
        .map(function (_a) {
        var constName = _a.constName;
        return constName;
    })
        .join(",\n  "), "\n};");
    return (assetImportText +
        "\n\n" +
        assetExportText +
        "\n\nmodule.exports = ".concat(variableName, ";"));
}
function updateAssetsFile(pathAndConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var basePath, outPath, variableName, variableNameCasing, target, isIncludingExt, returnNewName, pathName, fileList, assetFileInfo, regexp, outPathDepth, depthPrefix, i, material, assetsTsText, savePath, ecmaVersion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    basePath = pathAndConfig.assets, outPath = pathAndConfig.out, variableName = pathAndConfig.vName, variableNameCasing = pathAndConfig.variableNameCasing, target = pathAndConfig.target, isIncludingExt = pathAndConfig.isIncludingExt;
                    returnNewName = (0, util_1.getCasingType)(variableNameCasing);
                    pathName = path.resolve(process.cwd(), basePath);
                    return [4 /*yield*/, (0, util_1.getFileList)(pathName, [])];
                case 1:
                    fileList = _a.sent();
                    assetFileInfo = fileList
                        .flat(Infinity)
                        .filter(Boolean)
                        .map(function (_a) {
                        var name = _a.name, ext = _a.ext, filePath = _a.filePath, size = _a.size;
                        var constName = returnNewName(name, ext, filePath, size, isIncludingExt);
                        return { constName: constName, filePath: filePath, size: size };
                    });
                    regexp = new RegExp("/", "g");
                    outPathDepth = Array.from(outPath.matchAll(regexp)).length;
                    depthPrefix = "";
                    for (i = 0; i < outPathDepth; i++) {
                        depthPrefix += "../";
                    }
                    material = {
                        config: pathAndConfig,
                        assetFileInfo: assetFileInfo,
                        depthPrefix: depthPrefix,
                        basePath: basePath,
                        variableName: variableName,
                    };
                    assetsTsText = makeAssetFileText(material);
                    // spinner.success({ text: `COMPLETED ✅` });
                    // const spinnerPath = createSpinner("CREATING ASSET IMPORT FILE...").start();
                    (0, util_js_1.log)(outPath);
                    savePath = path.resolve(process.cwd(), "".concat(outPath));
                    fs.writeFileSync(savePath, assetsTsText);
                    ecmaVersion = target === constants_1.ES_VERSION.ES5 ? 3 : 2015;
                    return [4 /*yield*/, (0, util_1.fixEslint)(outPath, ecmaVersion)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function assetsToImportFile(path, config) {
    return __awaiter(this, void 0, void 0, function () {
        var assets, out, vName, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assets = path.assets, out = path.out, vName = path.vName;
                    if (!assets) {
                        return [2 /*return*/, (0, util_js_1.err)("PLEASE CHECK THE ASSET PATH. assets: ".concat(assets))];
                    }
                    if (!out) {
                        return [2 /*return*/, (0, util_js_1.err)("PLEASE CHECK THE OUTFILE. out: ".concat(out))];
                    }
                    if (!vName) {
                        return [2 /*return*/, (0, util_js_1.err)("PLEASE CHECK THE VARIABLE NAME. vName: ".concat(vName))];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, updateAssetsFile(__assign(__assign({}, path), config))];
                case 2:
                    _a.sent();
                    fs.watch(assets, {
                        recursive: true,
                    }, function (eventType, fileName) {
                        var fName = fileName || "_UNKNOWN_";
                        (0, util_js_1.log)("DETECT FILE CHANGES [".concat(eventType, " EVENT] - ").concat(fName));
                        updateAssetsFile(__assign(__assign({}, path), config));
                    });
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    (0, util_js_1.err)("THERE WAS A PROBLEM UPDATING THE FILE.");
                    console.error(e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
