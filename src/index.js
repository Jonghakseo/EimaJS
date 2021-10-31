import { makeConfigFile } from "./util";
import { help } from "./console";

const { msg, log } = require("./console");
const { assetsToImportFile } = require("./assetsToImportFile");

const fs = require("fs");
const path = require("path");

/**
 *  명령어는 경로는 1번째 인자로 받아옵니다.
 */
const cmd = process.argv.slice(2)[0];
const cmds = ["init", "start"];
if (!cmd || !cmds.includes(cmd)) {
  help("명령을 찾을 수 없습니다. Hint: eima init");
} else if (cmd === "init") {
  initial();
} else if (cmd === "start") {
  start();
}

function initial() {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  msg("(1/3) {선택} 에셋 폴더 경로를 입력해주세요. 기본: [assets]");
  let baseOptions = [];
  rl.on("line", function (line) {
    let input = line;
    // msg(input);
    switch (baseOptions.length) {
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
        const text = `현재 설정으로 시작하시겠습니까? [Y]
            에셋 폴더   : ${baseOptions[0]}
            내보낼 파일 : ${baseOptions[1]}
            변수명      : ${baseOptions[2]}
    `;
        msg(text);
        break;
      case 3:
        if (line === "Y" || line === "y") {
          rl.close();
        } else {
          process.exit();
        }
        break;
    }
    // rl.close();
  }).on("close", function () {
    makeConfigFile(baseOptions);
    log(
      "에셋 폴더 설정이 완료되었습니다. 이후 에셋 폴더 감시는 eima start를 통해 시작할 수 있습니다."
    );
    start();
  });
}

function start() {
  /**
   *  에셋 경로는 2번째 인자로 받아옵니다.
   */
  const assetDir = process.argv.slice(3)[0] || "assets";
  /**
   * 내보낼 경로는 3번째 인자로 받아옵니다.
   */
  const outPath = process.argv.slice(4)[0] || "assets.js";

  const configPath = path.resolve(process.cwd(), "eima.json");

  let config = null;
  /**
   * simple mode - 한 개의 에셋 폴더, 한 개의 import file
   */
  const SIMPLE_MODE = "SIMPLE";
  /**
   * config mode - 한 개 이상의 에셋 폴더, 한 개 이상의 import file
   */
  const CONFIG_MODE = "CONFIG";

  let mode = SIMPLE_MODE;

  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    if (!config.paths || config.paths.length === 0) {
      help("eima.json 파일에서 paths 값을 확인해주세요.");
    } else {
      mode = CONFIG_MODE;
    }
  } catch (e) {
    // config 관련 에러인 경우 무시
    if (!e.path || !e.path.includes("eima.json")) console.error(e);
  }

  if (mode === SIMPLE_MODE) {
    msg(
      "eima.json 파일을 찾을 수 없거나 읽을 수 없습니다. 심플모드로 동작합니다."
    );
    assetsToImportFile({ assetDir, outFile: outPath });
  } else if (mode === CONFIG_MODE) {
    log("eima.json 파일을 찾았습니다.");
    config.paths.forEach(({ assets, out, vName }) => {
      assetsToImportFile({ assetDir: assets, outFile: out, vName }, config);
    });
  }
}
