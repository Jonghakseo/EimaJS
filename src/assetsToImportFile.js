import { help } from "./console";
import { ES_VERSION } from "./constants";
const { ESLint } = require("eslint");
const fs = require("fs");
const path = require("path");
const { getFileList } = require("./util");
const { log } = require("./console");

function makeAssetFileTextEs6(
  assetFileInfo,
  depthPrefix,
  basePath,
  variableName
) {
  const assetImportText =
    assetFileInfo
      .map(({ constName, filePath }) => {
        return `import ${constName} from "${depthPrefix}${basePath}/${filePath}"`;
      })
      .join(";\n") + ";";

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

function makeAssetFileTextEs5(
  assetFileInfo,
  depthPrefix,
  basePath,
  variableName
) {
  const assetImportText =
    assetFileInfo
      .map(({ constName, filePath }) => {
        return `var ${constName} = require("${depthPrefix}${basePath}/${filePath}");`;
      })
      .join(";\n") + ";";

  const assetExportText = `var ${variableName} = {\n  ${assetFileInfo
    .map(({ constName }) => constName)
    .join(",\n  ")}\n};`;

  return (
    assetImportText +
    "\n\n" +
    assetExportText +
    `\n\nmodule.export = ${variableName};`
  );
}

export async function updateAssetsFile(baseOption, config) {
  const {
    assetDir: basePath,
    outFile: outPath,
    vName: variableName,
  } = baseOption;

  const { target } = config;

  if (basePath) {
    const pathName = path.resolve(process.cwd(), basePath);
    try {
      log("파일 목록을 가져오는 중...");
      const fileList = await getFileList(pathName, []);
      const assetFileInfo = fileList
        .flat(Infinity)
        .filter(Boolean)
        .map(({ name, ext, filePath }) => {
          const constName =
            name.replace(/[^\w\s]/gim, "_") + "_" + ext.toUpperCase();
          return { constName, filePath };
        });

      const regexp = new RegExp("/", "g");
      const outPathDepth = Array.from(outPath.matchAll(regexp)).length;
      let depthPrefix = "";
      for (let i = 0; i < outPathDepth; i++) {
        depthPrefix += "../";
      }
      let assetsTsText;
      if (target === ES_VERSION.ES5) {
        assetsTsText = makeAssetFileTextEs5(
          assetFileInfo,
          depthPrefix,
          basePath,
          variableName
        );
      } else {
        assetsTsText = makeAssetFileTextEs6(
          assetFileInfo,
          depthPrefix,
          basePath,
          variableName
        );
      }

      const savePath = path.resolve(process.cwd(), `${outPath}`);
      log("에셋 import파일 생성중...");
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
      const result = await eslint.lintFiles([outPath]);
      log("eslint 실행중...");
      await ESLint.outputFixes(result);
      log(
        basePath,
        " - 에셋파일이 성공적으로 업데이트 되었습니다."
        // assetFileInfo
      );
    } catch (e) {
      console.error(e);
    }
  }
}

export function assetsToImportFile(baseOption, config) {
  const { assetDir, outFile, vName } = baseOption;
  // const { target } = config || {};
  if (!assetDir) {
    return help(`asset 경로를 확인해주세요 assetDir: ${assetDir}`);
  }
  if (!outFile) {
    return help(`out 경로를 확인해주세요 outFile: ${outFile}`);
  }
  if (!vName) {
    return help(`vName을 확인해주세요 vName: ${vName}`);
  }
  updateAssetsFile(baseOption, config)
    .then(() => {
      fs.watch(
        assetDir,
        {
          recursive: true,
        },
        (eventType, fileName) => {
          const fName = fileName || "알 수 없음";
          log(`파일 변경 감지 [${eventType} event] - ${fName}`);
          updateAssetsFile(baseOption, config).catch((e) => console.error(e));
        }
      );
    })
    .catch((e) => {
      log("파일 업데이트에서 문제가 발생했습니다.");
      console.error(e);
    });
}
