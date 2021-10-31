const fs = require("fs");
const path = require("path");
const { getFileList, msg } = require("./util");

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
        .map(({ name, filePath }) => {
          const underBar = /-/gi;
          const constName = name.replace(underBar, "_");
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
      msg(
        basePath,
        "에셋파일이 성공적으로 업데이트 되었습니다.\n",
        assetFileInfo
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
    return msg("asset 경로를 확인해주세요 assetDir:", assetDir);
  }
  if (!outFile) {
    return msg("out 경로를 확인해주세요 outFile:", outFile);
  }
  const variableName = vName || "ASSETS";
  updateAssetsFile(baseOption)
    .then(() => {
      fs.watch(
        assetDir,
        {
          recursive: true,
        },
        (eventType, fileName) => {
          msg(eventType, fileName || "알 수 없음");
          updateAssetsFile(baseOption).catch((e) => console.error(e));
        }
      );
    })
    .catch((e) => {
      msg("파일 업데이트에서 문제가 발생했습니다.");
      console.error(e);
    });
}
