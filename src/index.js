const { msg } = require("./util");
const { assetsToImportFile } = require("./assetsToImportFile");

const fs = require("fs");
const path = require("path");

/**
 * simple mode - 한 개의 에셋 폴더, 한 개의 import file
 */
const SIMPLE_MODE = "SIMPLE";
/**
 * config mode - 한 개 이상의 에셋 폴더, 한 개 이상의 import file
 */
const CONFIG_MODE = "CONFIG";

let mode = SIMPLE_MODE;

/**
 *  에셋 경로는 2번째 인자로 받아옵니다.
 */
const assetDir = process.argv.slice(2)[0] || "assets";
/**
 * 내보낼 경로는 3번째 인자로 받아옵니다.
 */
const outPath = process.argv.slice(3)[0] || "assets.js";

const configPath = path.resolve(process.cwd(), "eima.json");

let config = null;

try {
  config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  if (!config.paths || config.paths.length === 0) {
    msg("eima.json 파일에서 paths 값을 확인해주세요.");
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
  config.paths.forEach(({ asset, out, vName }) => {
    assetsToImportFile({ assetDir: asset, outFile: out, vName }, config);
  });
}
