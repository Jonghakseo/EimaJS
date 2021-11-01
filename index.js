"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _util = require("./util");

var _console = require("./console");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _require = require("./console"),
    msg = _require.msg,
    log = _require.log;

var _require2 = require("./assetsToImportFile"),
    assetsToImportFile = _require2.assetsToImportFile;

var fs = require("fs");

var path = require("path");
/**
 *  명령어는 경로는 1번째 인자로 받아옵니다.
 */


var cmd = process.argv.slice(2)[0];
var cmds = ["init", "start"];

if (!cmd || !cmds.includes(cmd)) {
  (0, _console.help)("명령을 찾을 수 없습니다. Hint: eima init");
} else if (cmd === "init") {
  initial();
} else if (cmd === "start") {
  start();
}

function initial() {
  var readline = require("readline");

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });
  var baseOptions = []; // let advancedOption = [];
  // msg("사용중인 EcmaScript 버전을 골라주세요 es5(require)/es6(import) 기본: [es6]");

  msg("(1/3) {선택} 에셋 폴더 경로를 입력해주세요. 기본: [assets]");
  rl.on("line", function (line) {
    var input = line; // msg(input);

    switch (baseOptions.length) {
      // case 0:
      //   input = line || "es6";
      // break;
      case 0:
        input = line || "assets";
        baseOptions.push(input);
        msg("(2/3) {선택} 내보낼 파일을 지정해주세요. 기본: [src/assets.js]");
        break;

      case 1:
        input = line || "src/assets.js";
        baseOptions.push(input);
        msg("(3/3) {선택} 내보낼 에셋 변수명을 지정해주세요. 기본: [ASSETS]");
        break;

      case 2:
        input = line || "ASSETS";
        baseOptions.push(input);
        var text = "\uD604\uC7AC \uC124\uC815\uC73C\uB85C \uC2DC\uC791\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C? [Y]\n            \uC5D0\uC14B \uD3F4\uB354   : ".concat(baseOptions[0], "\n            \uB0B4\uBCF4\uB0BC \uD30C\uC77C : ").concat(baseOptions[1], "\n            \uBCC0\uC218\uBA85      : ").concat(baseOptions[2], "\n    ");
        msg(text);
        break;

      case 3:
        if (line === "Y" || line === "y") {
          msg("설정 완료");
          rl.close();
        } else {
          msg("설정 중단");
          process.exit();
        }

        break;
    } // rl.close();

  }).on("close", function () {
    (0, _util.makeConfigFile)(baseOptions);
    log("에셋 폴더 설정이 완료되었습니다. 이후 에셋 폴더 감시는 eima start를 통해 시작할 수 있습니다.");
    start();
  });
}

function start() {
  /**
   *  에셋 경로는 2번째 인자로 받아옵니다.
   */
  var assetDir = process.argv.slice(3)[0] || "assets";
  /**
   * 내보낼 경로는 3번째 인자로 받아옵니다.
   */

  var outPath = process.argv.slice(4)[0] || "assets.js";
  var configPath = path.resolve(process.cwd(), "eima.json");
  var config = null;
  /**
   * simple mode - 한 개의 에셋 폴더, 한 개의 import file
   */

  var SIMPLE_MODE = "SIMPLE";
  /**
   * config mode - 한 개 이상의 에셋 폴더, 한 개 이상의 import file
   */

  var CONFIG_MODE = "CONFIG";
  var mode = SIMPLE_MODE;

  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    if (!config.paths || config.paths.length === 0) {
      (0, _console.help)("eima.json 파일에서 paths 값을 확인해주세요.");
    } else {
      mode = CONFIG_MODE;
    }
  } catch (e) {
    // config 관련 에러인 경우 무시
    if (!e.path || !e.path.includes("eima.json")) console.error(e);
  }

  if (mode === SIMPLE_MODE) {
    msg("eima.json 파일을 찾을 수 없거나 읽을 수 없습니다. 심플모드로 동작합니다.");
    assetsToImportFile({
      assetDir: assetDir,
      outFile: outPath
    });
  } else if (mode === CONFIG_MODE) {
    log("eima.json 파일을 찾았습니다.");

    var _config = _objectSpread({}, config),
        target = _config.target;

    config.paths.forEach(function (_ref) {
      var assets = _ref.assets,
          out = _ref.out,
          vName = _ref.vName;
      assetsToImportFile({
        assetDir: assets,
        outFile: out,
        vName: vName
      }, config);
    });
  }
}