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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCasingType = exports.getConfig = exports.mergeAllSourceFile = exports.fixEslint = exports.createConfigFile = exports.makeSnakeWithUpperCaseName = exports.makeSnakeCaseName = exports.makeCamelCaseName = exports.makePascalCaseName = exports.getFilePathList = exports.getFileList = exports.getLineInput = exports.box = exports.help = exports.err = exports.msg = exports.log = exports.sleep = void 0;
var path = require("path");
var fs = require("fs");
var util = require("util");
var readline = require("readline");
var chalk = require("chalk");
var box_console_1 = require("box-console");
var constants_1 = require("./constants");
var eslint_1 = require("eslint");
var pattern = /[^ㄱ-ㅎ|가-힣\w\s]/;
var sleep = function (ms) {
    if (ms === void 0) { ms = 900; }
    return new Promise(function (r) { return setTimeout(r, ms); });
};
exports.sleep = sleep;
exports.log = console.log;
// export const log = (m: string) => log(chalk.blue(m));
var msg = function (m) { return (0, exports.log)(chalk.greenBright(m)); };
exports.msg = msg;
var err = function (m) { return (0, exports.log)(chalk.red(m)); };
exports.err = err;
var help = function (m) { return (0, exports.log)(chalk.yellow(m)); };
exports.help = help;
var box = function (msgs) { return (0, box_console_1.default)(msgs); };
exports.box = box;
function getLineInput(lineCb) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });
    rl.on("line", function (line) {
        rl.close();
        lineCb(line);
    });
}
exports.getLineInput = getLineInput;
// ? fs의 readDir 메소드를 promisify 하게 wrapping 합니다.
var readdir = util.promisify(fs.readdir);
// ? file List를 파싱합니다.
function getFileList(pathname, prefix) {
    return __awaiter(this, void 0, void 0, function () {
        var targetPath, fileNames;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    targetPath = prefix
                        ? "".concat(pathname, "/").concat(prefix.join("/"))
                        : pathname;
                    return [4 /*yield*/, readdir(targetPath)];
                case 1:
                    fileNames = _a.sent();
                    // ? 찾은 모든 파일에 대해 병렬적으로 프로세스 실행
                    return [2 /*return*/, Promise.all(fileNames.map(function (name) {
                            var fullFilePath = path.resolve(targetPath, name);
                            var fileStat = fs.statSync(fullFilePath);
                            // ? 숨김파일, 숨김폴더인 경우 탐색 제외
                            if (name.length > 0 && name.charAt(0) === ".")
                                return null;
                            // ? 폴더인 경우 재귀 탐색
                            if (fileStat.isDirectory())
                                return getFileList(pathname, __spreadArray(__spreadArray([], __read(prefix), false), [name], false));
                            // ? 파일인 경우만 아래 로직 진행
                            if (!fileStat.isFile())
                                return null;
                            // ? 상수명 (.) dot split
                            var CONSTANTS_NAME = name.split(".")[0];
                            // let CONSTANTS_NAME = name.toUpperCase().split(".")[0];
                            // ? 숫자로 시작하는 파일명 캇트
                            if (CONSTANTS_NAME.substr(0, 1).match(new RegExp("^[0-9]"))) {
                                throw new Error("[".concat(constants_1.EIMA, "] A NUMBER CANNOT BE AT THE BEGINNING OF THE FILE NAME."));
                            }
                            // ? 확장자
                            var ext = path.extname(name).slice(1);
                            // ? 용량 kb
                            var unit = "kb";
                            var rawSize = fileStat.size;
                            var size = Math.round(rawSize / 1024);
                            if (size > 1024) {
                                size = Math.round(size / 102.4) / 10;
                                unit = "mb";
                            }
                            // ? 상수명 선언
                            var filePath = name;
                            // ? prefix(depth)가 없으면 파일명이 곧 경로
                            if (prefix.length > 0) {
                                // ? 그렇지 않으면 경로를 포함해서 상수명 및 경로 수정
                                CONSTANTS_NAME = "".concat(prefix.join("_"), "_").concat(CONSTANTS_NAME);
                                // .toUpperCase()}_${CONSTANTS_NAME}`;
                                filePath = "".concat(prefix.join("/"), "/").concat(name);
                            }
                            // ? resolve 처리
                            return new Promise(function (resolve) {
                                resolve({
                                    name: CONSTANTS_NAME,
                                    ext: ext,
                                    filePath: filePath,
                                    size: "".concat(size).concat(unit),
                                    _fullFilePath: fullFilePath,
                                    _rawSize: rawSize,
                                });
                            });
                        }))];
            }
        });
    });
}
exports.getFileList = getFileList;
function getFilePathList(pathname, prefix) {
    return __awaiter(this, void 0, void 0, function () {
        var targetPath, fileNames;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    targetPath = prefix ? "".concat(pathname, "/").concat(prefix.join("/")) : pathname;
                    return [4 /*yield*/, readdir(targetPath)];
                case 1:
                    fileNames = _a.sent();
                    return [2 /*return*/, Promise.all(fileNames.map(function (name) {
                            var fullFilePath = path.resolve(targetPath, name);
                            var fileStat = fs.statSync(fullFilePath);
                            if (fileStat.isDirectory())
                                return getFilePathList(pathname, __spreadArray(__spreadArray([], __read(prefix), false), [name], false));
                            if (!fileStat.isFile())
                                return null;
                            var filePath = name;
                            if (prefix.length > 0)
                                filePath = "".concat(prefix.join("/"), "/").concat(name);
                            return new Promise(function (resolve) {
                                resolve(filePath);
                            });
                        }))];
            }
        });
    });
}
exports.getFilePathList = getFilePathList;
// 변수명 작명법에 따른 파일 이름을 만든다
function makePascalCaseName(name, ext, isIncludingExt, filePath, size) {
    var nameArr = __spreadArray([], __read(name), false);
    var constName = "".concat(nameArr
        .map(function (l, idx) {
        if (idx === 0)
            return l.toUpperCase();
        if (!pattern.test(l) && l.trim())
            return l;
        if (pattern.test(nameArr[idx - 1]))
            return l.toUpperCase();
    })
        .join("")).concat(isIncludingExt ? "".concat(ext[0].toUpperCase()).concat(__spreadArray([], __read(ext), false).slice(1).join("")) : "");
    return constName;
}
exports.makePascalCaseName = makePascalCaseName;
function makeCamelCaseName(name, ext, isIncludingExt, filePath, size) {
    var nameArr = __spreadArray([], __read(name), false);
    var constName = "".concat(nameArr
        .map(function (l, idx) {
        if (idx === 0)
            return l.toLowerCase();
        if (nameArr[idx - 1] === "_" || nameArr[idx - 1] === "-")
            return l.toUpperCase();
        if (!pattern.test(l) && l.trim() && l !== "_" && l !== "-")
            return l;
        if (pattern.test(l))
            return "";
    })
        .join("")).concat(isIncludingExt ? "".concat(ext[0].toUpperCase()).concat(__spreadArray([], __read(ext), false).slice(1).join("")) : "");
    return constName;
}
exports.makeCamelCaseName = makeCamelCaseName;
function makeSnakeCaseName(name, ext, isIncludingExt, filePath, size) {
    var constName = "".concat(__spreadArray([], __read(name), false).map(function (l) {
        if (!pattern.test(l) && l.trim())
            return l.toLowerCase();
        if (pattern.test(l))
            return "_";
    })
        .join("")).concat(isIncludingExt ? "_".concat(ext) : "");
    return constName;
}
exports.makeSnakeCaseName = makeSnakeCaseName;
function makeSnakeWithUpperCaseName(name, ext, isIncludingExt, filePath, size) {
    var constName = "".concat(__spreadArray([], __read(name), false).map(function (l) {
        if (!pattern.test(l) && l.trim())
            return l.toUpperCase();
        if (pattern.test(l))
            return "_";
    })
        .join("")).concat(isIncludingExt ? "_".concat(ext.toUpperCase()) : "");
    return constName;
}
exports.makeSnakeWithUpperCaseName = makeSnakeWithUpperCaseName;
// aima.json 파일을 만든다.
function createConfigFile(_a) {
    var target = _a.target, assetPath = _a.assetPath, outputPath = _a.outputPath, variableName = _a.variableName, variableNameCasing = _a.variableNameCasing, isIncludingExt = _a.isIncludingExt;
    return __awaiter(this, void 0, void 0, function () {
        var configJson, savePath;
        return __generator(this, function (_b) {
            configJson = {
                target: target,
                hideSize: false,
                isIncludingExt: isIncludingExt,
                variableNameCasing: variableNameCasing,
                lintPath: "src",
                paths: [
                    {
                        assets: assetPath,
                        out: outputPath,
                        vName: variableName,
                    },
                ],
            };
            savePath = path.resolve(process.cwd(), "eima.json");
            fs.writeFileSync(savePath, JSON.stringify(configJson));
            return [2 /*return*/];
        });
    });
}
exports.createConfigFile = createConfigFile;
function fixEslint(outPath, ecmaVersion) {
    if (ecmaVersion === void 0) { ecmaVersion = 2015; }
    return __awaiter(this, void 0, void 0, function () {
        var eslint, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eslint = new eslint_1.ESLint({
                        fix: true,
                        overrideConfig: {
                            parserOptions: {
                                ecmaVersion: ecmaVersion,
                            },
                        },
                    });
                    return [4 /*yield*/, eslint.lintFiles([outPath])];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, eslint_1.ESLint.outputFixes(result)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.fixEslint = fixEslint;
function mergeAllSourceFile(path, files, cb) {
    var stream = "";
    var count = 0;
    files.forEach(function (fileName) {
        fs.readFile("".concat(path).concat(fileName), "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            else {
                if (data.indexOf(constants_1.EIMA_ASSET_EXPORT_FILE) === -1) {
                    // 에셋파일 -> 제외
                    stream += data;
                }
                count += 1;
                if (count === files.length) {
                    cb(stream);
                }
            }
        });
    });
}
exports.mergeAllSourceFile = mergeAllSourceFile;
function getConfig() {
    var configPath = path.resolve(process.cwd(), "eima.json");
    var config = null;
    try {
        var configJson = JSON.parse(fs.readFileSync(configPath, "utf8"));
        if (!configJson.paths || configJson.paths.length === 0) {
            (0, exports.help)("Please check paths property in eima.json");
        }
        else {
            config = configJson;
        }
    }
    catch (e) {
        // config 관련 에러인 경우 ignore
        if (!e.path || !e.path.includes("eima.json"))
            console.error(e);
    }
    return config;
}
exports.getConfig = getConfig;
var getCasingType = function (variableNameCasing) {
    var getName;
    switch (variableNameCasing) {
        case "Camel":
            getName = makeCamelCaseName;
            break;
        case "Snake":
            getName = makeSnakeCaseName;
            break;
        case "Pascal":
            getName = makePascalCaseName;
            break;
        default:
            getName = makeSnakeWithUpperCaseName;
            break;
    }
    return getName;
};
exports.getCasingType = getCasingType;
