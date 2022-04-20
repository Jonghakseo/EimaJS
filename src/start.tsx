import * as fs from "fs";
import * as path from "path";

import {
  fixEslint,
  getConfig,
  getFileList,
  makePascalCaseName,
  makeSnakeCaseName,
  makeSnakeWithUpperCaseName,
  makeCamelCaseName,
} from "./util";
import {
  DEFAULT_CONFIG,
  EIMA_ASSET_EXPORT_FILE,
  ES_VERSION,
} from "./constants";
import { err, help, log } from "./ink";

export function eimaStart() {
  const configJson = getConfig();
  const config = configJson || DEFAULT_CONFIG;

  if (!configJson) {
    help("Could not be found or read eima.json. Operate in simple mode.");
  } else {
    help("eima.json Has been found.");
  }

  if (!(config.target === ES_VERSION.ES5 || config.target === ES_VERSION.ES6)) {
    err("Please check the target ecma script version in eima.json. (es5/es6)");
    process.exit();
  }

  config.paths.forEach((path) => {
    void assetsToImportFile(path, config);
  });
}

function makeAssetFileText(material) {
  const {
    config: { target },
  } = material;
  const prefix = `// ${EIMA_ASSET_EXPORT_FILE}\n`;
  let assetText = "";
  if (target === ES_VERSION.ES5) {
    assetText = makeAssetFileTextEs5(material);
  }
  if (target === ES_VERSION.ES6) {
    assetText = makeAssetFileTextEs6(material);
  }
  return prefix + assetText;
}

function makeAssetFileTextEs6({
  config,
  assetFileInfo,
  depthPrefix,
  basePath,
  variableName,
}) {
  const { hideSize } = config;
  const assetImportText = assetFileInfo
    .map(({ constName, filePath, size }) => {
      const sizeComment = hideSize ? "" : `// ${size}`;
      return `import ${constName} from "${depthPrefix}${basePath}/${filePath}"; ${sizeComment}`;
    })
    .join("\n");

  const assetExportText = `const ${variableName} = {\n  ${assetFileInfo
    .map(({ constName }) => constName)
    .join(",\n  ")}\n};`;

  return (
    assetImportText +
    "\n\n" +
    assetExportText +
    `\n\nexport default ${variableName};`
  );
}

function makeAssetFileTextEs5({
  config,
  assetFileInfo,
  depthPrefix,
  basePath,
  variableName,
}) {
  const { hideSize } = config;
  const assetImportText = assetFileInfo
    .map(({ constName, filePath, size }) => {
      const sizeComment = hideSize ? "" : `// ${size}`;
      return `var ${constName} = require("${depthPrefix}${basePath}/${filePath}"); ${sizeComment}`;
    })
    .join("\n");

  const assetExportText = `var ${variableName} = {\n  ${assetFileInfo
    .map(({ constName }) => constName)
    .join(",\n  ")}\n};`;

  return (
    assetImportText +
    "\n\n" +
    assetExportText +
    `\n\nmodule.exports = ${variableName};`
  );
}

async function updateAssetsFile(pathAndConfig) {
  const {
    assets: basePath,
    out: outPath,
    vName: variableName,
    variableNameCasing,
    target,
    isIncludingExt,
  } = pathAndConfig;

  let getname;

  switch (variableNameCasing) {
    case "Camel":
      getname = makeCamelCaseName;
      break;
    case "Snake":
      getname = makeSnakeCaseName;
      break;
    case "Pascal":
      getname = makePascalCaseName;
      break;

    default:
      getname = makeSnakeWithUpperCaseName;
      break;
  }

  const pathName = path.resolve(process.cwd(), basePath);
  // ? 파일 목록 재귀로 가져옴
  log("GETTING LIST OF FILES...");

  const fileList = await getFileList(pathName, []);
  const assetFileInfo = fileList
    .flat(Infinity)
    .filter(Boolean)
    .map(({ name, ext, filePath, size }) => {
      const constName = getname(name, ext, filePath, size, isIncludingExt);
      return { constName, filePath, size };
    });

  const regexp = new RegExp("/", "g");
  const outPathDepth = Array.from(outPath.matchAll(regexp)).length;
  let depthPrefix = "";
  for (let i = 0; i < outPathDepth; i++) {
    depthPrefix += "../";
  }

  const material = {
    config: pathAndConfig,
    assetFileInfo,
    depthPrefix,
    basePath,
    variableName,
  };
  let assetsTsText = makeAssetFileText(material);

  log("CREATING ASSET IMPORT FILE...");
  log(outPath);
  const savePath = path.resolve(process.cwd(), `${outPath}`);
  fs.writeFileSync(savePath, assetsTsText);

  log("RUNNING ESLINT...");
  let ecmaVersion = target === ES_VERSION.ES5 ? 3 : 2015;
  await fixEslint(outPath, ecmaVersion);

  log(`${basePath} - ASSETFILE HAS BEEN SUCCESSFULLY UPDATED.`);
}

async function assetsToImportFile(path, config) {
  const { assets, out, vName } = path;

  if (!assets) {
    return err(`PLEASE CHECK THE ASSET PATH. assets: ${assets}`);
  }
  if (!out) {
    return err(`PLEASE CHECK THE OUTFILE. out: ${out}`);
  }
  if (!vName) {
    return err(`PLEASE CHECK THE VARIABLE NAME. vName: ${vName}`);
  }
  try {
    await updateAssetsFile({ ...path, ...config });
    fs.watch(
      assets,
      {
        recursive: true,
      },
      (eventType, fileName) => {
        const fName = fileName || "_UNKNOWN_";
        log(`DETECT FILE CHANGES [${eventType} EVENT] - ${fName}`);
        updateAssetsFile({ ...path, ...config });
      }
    );
  } catch (e) {
    err("THERE WAS A PROBLEM UPDATING THE FILE.");
    console.error(e);
  }
}
