import { help } from "./console";
const { ESLint } = require("eslint");
const fs = require("fs");
const path = require("path");
const { getFileList } = require("./util");
const { log } = require("./console");

export async function updateAssetsFile(baseOption) {
  const {
    assetDir: basePath,
    outFile: outPath,
    vName: variableName,
  } = baseOption;
  if (basePath) {
    const pathName = path.resolve(process.cwd(), basePath);
    try {
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
      const assetImportText =
        assetFileInfo
          .map(({ constName, filePath }) => {
            return `import ${constName} from "${depthPrefix}${basePath}/${filePath}"`;
          })
          .join(";\n") + ";";
      const assetExportText = `const ${variableName} = {\n  ${assetFileInfo
        .map(({ constName }) => constName)
        .join(",\n  ")}\n};`;

      const assetsTsText =
        assetImportText +
        "\n\n" +
        assetExportText +
        `\n\nexport default ${variableName};`;

      const savePath = path.resolve(process.cwd(), `${outPath}`);
      fs.writeFileSync(savePath, assetsTsText);
      const eslint = new ESLint({
        fix: true,
      });
      const result = await eslint.lintFiles([outPath]);
      console.log(result);
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

export function assetsToImportFile(baseOption, additionalOption) {
  const { assetDir, outFile, vName } = baseOption;
  const { target } = additionalOption || {};

  if (!assetDir) {
    return help(`asset 경로를 확인해주세요 assetDir: ${assetDir}`);
  }
  if (!outFile) {
    return help(`out 경로를 확인해주세요 outFile: ${outFile}`);
  }
  if (!vName) {
    return help(`vName을 확인해주세요 vName: ${vName}`);
  }
  updateAssetsFile(baseOption)
    .then(() => {
      fs.watch(
        assetDir,
        {
          recursive: true,
        },
        (eventType, fileName) => {
          const fName = fileName || "알 수 없음";
          log(`파일 변경 감지 [${eventType} event] - ${fName}`);
          updateAssetsFile(baseOption).catch((e) => console.error(e));
        }
      );
    })
    .catch((e) => {
      log("파일 업데이트에서 문제가 발생했습니다.");
      console.error(e);
    });
}
