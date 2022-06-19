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
exports.eimaLint = void 0;
var fs = require("fs");
var inquirer_1 = require("inquirer");
var nanospinner_1 = require("nanospinner");
var util_1 = require("./util");
function eimaLint(path) {
    return __awaiter(this, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer_1.default.prompt({
                        name: "experimental",
                        type: "list",
                        message: "The Lint Feature Is Experimental And The Results May Not Be Accurate. Do You Still Want To Run It? (Y/N) [N]",
                        choices: ["Y", "N"],
                        default: function () {
                            return "Y";
                        },
                    })];
                case 1:
                    answer = _a.sent();
                    if (answer.experimental === "Y")
                        assetLint(path);
                    else
                        process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
exports.eimaLint = eimaLint;
function assetLint(pathParam) {
    return __awaiter(this, void 0, void 0, function () {
        var config, fileListPromise, importNames_1, path, fileLists, filePaths, e_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = (0, util_1.getConfig)();
                    if (!config || config.paths.length === 0) {
                        (0, util_1.err)("Please Check eima.json");
                        process.exit();
                    }
                    if (!config.lintPath && !pathParam) {
                        (0, util_1.err)("The Lint Feature Requires The Folder Path You Want To Search To. Please Check lintPath in eima.json or -p [path] argument");
                        process.exit();
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, Promise.all(config.paths.map(function (_a) {
                            var assets = _a.assets;
                            return (0, util_1.getFileList)(assets, []);
                        }))];
                case 2:
                    fileListPromise = _a.sent();
                    importNames_1 = fileListPromise.flat(Infinity).map(function (asset) {
                        var name = asset.name, ext = asset.ext;
                        console.log({ asset: asset });
                        var returnNewName = (0, util_1.getCasingType)(config.variableNameCasing);
                        var constName = 
                        // TODO: 선택한 케이스로 바꿔줘야 함
                        name.replace(/[^\w\s]/gim, "_") + "_" + ext.toUpperCase();
                        //  getname(name, ext, config.asstes, size, config.isIncludingExt);
                        return __assign(__assign({}, asset), { name: constName });
                    });
                    path = "".concat(pathParam || config.lintPath);
                    return [4 /*yield*/, (0, util_1.getFilePathList)(path, [""])];
                case 3:
                    fileLists = _a.sent();
                    filePaths = fileLists.filter(Boolean).flat(Infinity);
                    (0, util_1.mergeAllSourceFile)(path, filePaths, function (stream) { return __awaiter(_this, void 0, void 0, function () {
                        var list, unUsed, answer, deletedFiles, spinner;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    list = "EIMA ASSET LINT(ALPHA)\n\n--LIST OF NON IN-USE ASSETS--\n\n";
                                    unUsed = importNames_1
                                        .map(function (asset) {
                                        var name = asset.name, size = asset.size;
                                        var case1 = stream.indexOf(".".concat(name)) === -1;
                                        var case2 = stream.indexOf("{".concat(name)) === -1;
                                        var case3 = stream.indexOf("{ ".concat(name)) === -1;
                                        var case4 = stream.indexOf(" ".concat(name, ",")) === -1;
                                        var unUsedCase = case1 && case2 && case3 && case4;
                                        //사용하지 않는 에셋
                                        if (unUsedCase) {
                                            list += "".concat(name, " ----- ").concat(size, "\n");
                                            return asset;
                                        }
                                        return null;
                                    })
                                        .filter(Boolean);
                                    (0, util_1.box)([list]);
                                    return [4 /*yield*/, inquirer_1.default.prompt({
                                            name: "delete",
                                            type: "list",
                                            message: "DO YOU WANT TO DELETE UNUSED FILES? 🗑️",
                                            choices: ["Y", "N"],
                                            default: function () {
                                                return "N";
                                            },
                                        })];
                                case 1:
                                    answer = _a.sent();
                                    deletedFiles = unUsed.reduce(function (names, _a) {
                                        var _fullFilePath = _a._fullFilePath;
                                        return names.concat(_fullFilePath);
                                    }, []);
                                    (0, util_1.box)(deletedFiles.join("\n"));
                                    if (answer.delete === "Y") {
                                        spinner = (0, nanospinner_1.createSpinner)("").start();
                                        unUsed.forEach(function (_a) {
                                            var _fullFilePath = _a._fullFilePath;
                                            return fs.unlinkSync(_fullFilePath);
                                        });
                                        spinner.success({ text: "UNUSED FILES DELETED \u2705" });
                                    }
                                    process.exit();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.error(e_1);
                    process.exit();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
