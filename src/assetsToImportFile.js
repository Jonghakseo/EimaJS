import { help } from "./console";
import { ES_VERSION } from "./constants";
const { ESLint } = require("eslint");
const fs = require("fs");
const path = require("path");
const { getFileList } = require("./util");
const { log } = require("./console");

function makeAssetFileText(material) {
  const {
    config: { target },
  } = material;
  if (target === ES_VERSION.ES5) {
    return makeAssetFileTextEs5(material);
  }
  if (target === ES_VERSION.ES6) {
    return makeAssetFileTextEs6(material);
  }
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

export async function updateAssetsFile(baseOption, config) {
  const {
    assetDir: basePath,
    outFile: outPath,
    vName: variableName,
  } = baseOption;

  const { target } = config;

  const pathName = path.resolve(process.cwd(), basePath);
  // ? 파일 목록 재귀로 가져옴
  log("GETTING LIST OF FILES...");

  const fileList = await getFileList(pathName, []);
  const assetFileInfo = fileList
    .filter(Boolean)
    .flat(Infinity)
    .map(({ name, ext, filePath, size }) => {
      // console.log(name, ext, filePath, size);
      const constName =
        name.replace(/[^\w\s]/gim, "_") + "_" + ext.toUpperCase();
      return { constName, filePath, size };
    });

  const regexp = new RegExp("/", "g");
  const outPathDepth = Array.from(outPath.matchAll(regexp)).length;
  let depthPrefix = "";
  for (let i = 0; i < outPathDepth; i++) {
    depthPrefix += "../";
  }

  const material = {
    config,
    assetFileInfo,
    depthPrefix,
    basePath,
    variableName,
  };
  let assetsTsText = makeAssetFileText(material);

  const savePath = path.resolve(process.cwd(), `${outPath}`);

  log("CREATING ASSET IMPORT FILE...");
  fs.writeFileSync(savePath, assetsTsText);

  let ecmaVersion = target === ES_VERSION.ES5 ? 3 : 2015;
  const eslint = new ESLint({
    fix: true,
    overrideConfig: {
      parserOptions: {
        ecmaVersion: ecmaVersion,
      },
    },
  });
  log("RUNNING ESLINT...");
  const result = await eslint.lintFiles([outPath]);
  await ESLint.outputFixes(result);

  log(`${basePath} - ASSETFILE HAS BEEN SUCCESSFULLY UPDATED.`);
}

export function assetsToImportFile(baseOption, config) {
  const { assetDir, outFile, vName } = baseOption;
  // const { target } = config || {};
  if (!assetDir) {
    return help(`PLEASE CHECK THE ASSET PATH. assetDir: ${assetDir}`);
  }
  if (!outFile) {
    return help(`PLEASE CHECK THE OUTFILE. outFile: ${outFile}`);
  }
  if (!vName) {
    return help(`PLEASE CHECK THE VARIABLE NAME. vName: ${vName}`);
  }
  updateAssetsFile(baseOption, config)
    .then(() => {
      fs.watch(
        assetDir,
        {
          recursive: true,
        },
        (eventType, fileName) => {
          const fName = fileName || "_UNKNOWN_";
          log(`DETECT FILE CHANGES [${eventType} EVENT] - ${fName}`);
          updateAssetsFile(baseOption, config).catch((e) => console.error(e));
        }
      );
    })
    .catch((e) => {
      log("THERE WAS A PROBLEM UPDATING THE FILE.");
      console.error(e);
    });
}
