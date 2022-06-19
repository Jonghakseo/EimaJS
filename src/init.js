#!/usr/bin/env node
"use strict";
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
exports.eimaInit = void 0;
var inquirer = require("inquirer");
var gradient = require("gradient-string");
var chalkAnimation = require("chalk-animation");
var figlet = require("figlet");
var nanospinner_1 = require("nanospinner");
var util_1 = require("./util");
var constants_1 = require("./constants");
var util_2 = require("./util");
function welcome() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    figlet("Welcome to EIMA!", function (err, data) {
                        console.log(gradient.pastel.multiline(data) + "\n");
                    });
                    return [4 /*yield*/, (0, util_2.sleep)()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function questionEsVersion() {
    return __awaiter(this, void 0, void 0, function () {
        var answers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt({
                        name: "questionEs",
                        type: "list",
                        message: "Please select version of ecma script: \n",
                        choices: ["es5(require)", "es6(import)"],
                    })];
                case 1:
                    answers = _a.sent();
                    return [2 /*return*/, answers.questionEs];
            }
        });
    });
}
//
function questionFolderPath(step) {
    return __awaiter(this, void 0, void 0, function () {
        var answers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt({
                        name: "questionFolderPath",
                        type: "input",
                        message: "(".concat(step, "/").concat(constants_1.TOTAL_STEP, ") Optional || Please enter the asset folder path.: \n"),
                        default: function () {
                            return "assets";
                        },
                    })];
                case 1:
                    answers = _a.sent();
                    return [2 /*return*/, answers.questionFolderPath];
            }
        });
    });
}
//
function questionFileToExport(step) {
    return __awaiter(this, void 0, void 0, function () {
        var answers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt({
                        name: "questionFileToExport",
                        type: "input",
                        message: "(".concat(step, "/").concat(constants_1.TOTAL_STEP, ") Optional || Please specify the file you want to export.: \n"),
                        default: function () {
                            return "src/assets.js";
                        },
                    })];
                case 1:
                    answers = _a.sent();
                    return [2 /*return*/, answers.questionFileToExport];
            }
        });
    });
}
// asset들을 모아놓은 오브젝트 변수명을 무엇으로 할지 입력 받음
function questionVariableName(step) {
    return __awaiter(this, void 0, void 0, function () {
        var answers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt({
                        name: "questionVariableName",
                        type: "input",
                        message: "(".concat(step, "/").concat(constants_1.TOTAL_STEP, ") Optional || Please specify the object's variable name that contains all assets you want to export.: \n"),
                        default: function () {
                            return "ASSETS";
                        },
                    })];
                case 1:
                    answers = _a.sent();
                    return [2 /*return*/, answers.questionVariableName];
            }
        });
    });
}
// 변수명 작성법 선택
function questionVariableNamingType(step) {
    return __awaiter(this, void 0, void 0, function () {
        var answers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt({
                        name: "questionVariableNamingType",
                        type: "list",
                        message: "(".concat(step, "/").concat(constants_1.TOTAL_STEP, ") Optional || Please select the variable casing.: \n"),
                        choices: constants_1.VARIABLE_CASING,
                        default: function () {
                            return constants_1.VARIABLE_CASING[constants_1.VARIABLE_CASING.length - 1];
                        },
                    })];
                case 1:
                    answers = _a.sent();
                    return [2 /*return*/, answers.questionVariableNamingType];
            }
        });
    });
}
// 확장자 포함하여 이름 작명할지 여부 선택
function questionIncludeExt(step) {
    return __awaiter(this, void 0, void 0, function () {
        var answers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt({
                        name: "questionIncludeExt",
                        type: "list",
                        message: "(".concat(step, "/").concat(constants_1.TOTAL_STEP, ") Optional || Do you want to include the ext of the file in variable name?: \n"),
                        choices: ["Y", "N"],
                        default: function () {
                            return "Y";
                        },
                    })];
                case 1:
                    answers = _a.sent();
                    return [2 /*return*/, answers.questionIncludeExt];
            }
        });
    });
}
// 선택한 내용 체크
function questionCheckAnswers(options) {
    return __awaiter(this, void 0, void 0, function () {
        var answers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt({
                        name: "questionCheckAnswers",
                        message: "es ver -------------- ".concat(options.target, "\n\n    assets path-------------- ").concat(options.assetPath, "\n\n    output path -------------- ").concat(options.outputPath, "\n\n    variable name -------------- ").concat(options.variableName, "\n\n    variable casing -------------- ").concat(options.variableNameCasing, "\n\n    include ext -------------- ").concat(options.isIncludingExt, "\n\n    "),
                        type: "list",
                        choices: ["Y", "N"],
                    })];
                case 1:
                    answers = _a.sent();
                    return [2 /*return*/, answers.questionCheckAnswers];
            }
        });
    });
}
////////////////////
function eimaInit() {
    return __awaiter(this, void 0, void 0, function () {
        var isDone, options, esVersion, folderPath, fileToExport, variableName, variableNameCasing, isIncludingExt, checkAnswers, spinner, spinner, rainbowTitle, spinner, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isDone = false;
                    options = {
                        target: "es6",
                        assetPath: "",
                        outputPath: "",
                        variableName: "",
                        variableNameCasing: "Camel",
                        isIncludingExt: true,
                    };
                    return [4 /*yield*/, welcome()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, questionEsVersion()];
                case 2:
                    esVersion = _a.sent();
                    options.target = esVersion.split("(")[0];
                    return [4 /*yield*/, questionFolderPath(1)];
                case 3:
                    folderPath = _a.sent();
                    options.assetPath = folderPath;
                    return [4 /*yield*/, questionFileToExport(2)];
                case 4:
                    fileToExport = _a.sent();
                    options.outputPath = fileToExport;
                    return [4 /*yield*/, questionVariableName(3)];
                case 5:
                    variableName = _a.sent();
                    options.variableName = variableName;
                    return [4 /*yield*/, questionVariableNamingType(4)];
                case 6:
                    variableNameCasing = _a.sent();
                    options.variableNameCasing = variableNameCasing;
                    return [4 /*yield*/, questionIncludeExt(5)];
                case 7:
                    isIncludingExt = _a.sent();
                    options.isIncludingExt = isIncludingExt.toLowerCase() === "y" ? true : false;
                    return [4 /*yield*/, questionCheckAnswers(options)];
                case 8:
                    checkAnswers = _a.sent();
                    if (checkAnswers.toLowerCase() !== "y") {
                        spinner = (0, nanospinner_1.createSpinner)("").start();
                        spinner.error({ text: "Setup has been stoped. \uD83D\uDC80" });
                        process.exit(1);
                    }
                    else {
                        isDone = true;
                        spinner = (0, nanospinner_1.createSpinner)("").start();
                        spinner.success({ text: "Great job! We are almost there!" });
                    }
                    if (!isDone)
                        return [2 /*return*/];
                    _a.label = 9;
                case 9:
                    _a.trys.push([9, 12, , 13]);
                    return [4 /*yield*/, (0, util_1.createConfigFile)(options)];
                case 10:
                    _a.sent();
                    console.clear();
                    rainbowTitle = chalkAnimation.rainbow("Setup has been completed! ✅");
                    return [4 /*yield*/, (0, util_2.sleep)()];
                case 11:
                    _a.sent();
                    rainbowTitle.stop();
                    spinner = (0, nanospinner_1.createSpinner)("").start();
                    spinner.success({ text: "Starting EIMA \uD83D\uDE80" });
                    return [3 /*break*/, 13];
                case 12:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.eimaInit = eimaInit;
