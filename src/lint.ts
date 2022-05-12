import * as fs from "fs";

import {
  getConfig,
  getFileList,
  getFilePathList,
  getLineInput,
  mergeAllSourceFile,
  err,
  msg,
  box,
} from "./util";

export async function eimaLint(path) {
  msg(
    "The Lint Feature Is Experimental And The Results May Not Be Accurate. Do You Still Want To Run It? (Y/N) [N]"
  );
  getLineInput((line) => {
    if (line === "Y" || line === "y") {
      assetLint(path);
    } else {
      process.exit();
    }
  });
}

async function assetLint(pathParam: string) {
  const config = getConfig();
  if (!config || config.paths.length === 0) {
    err("Please Check eima.json");
    process.exit();
  }
  if (!config.lintPath && !pathParam) {
    err(
      "The Lint Feature Requires The Folder Path You Want To Search To. Please Check lintPath in eima.json or -p [path] argument"
    );
    process.exit();
  }
  try {
    const fileListPromise = await Promise.all(
      config.paths.map(({ assets }) => getFileList(assets, []))
    );

    const importNames = fileListPromise.flat(Infinity).map((asset) => {
      const { name, ext } = asset;
      const constName =
        name.replace(/[^\w\s]/gim, "_") + "_" + ext.toUpperCase();
      return { ...asset, name: constName };
    });

    const path = `${pathParam || config.lintPath}`;
    const fileLists = await getFilePathList(path, [""]);
    const filePaths = fileLists.filter(Boolean).flat(Infinity);
    mergeAllSourceFile(path, filePaths, (stream) => {
      let list = "EIMA ASSET LINT(ALPHA)\n\n--LIST OF NON IN-USE ASSETS--\n\n";
      const unUsed = importNames
        .map((asset) => {
          const { name, size } = asset;

          const case1 = stream.indexOf(`.${name}`) === -1;
          const case2 = stream.indexOf(`{${name}`) === -1;
          const case3 = stream.indexOf(`{ ${name}`) === -1;
          const case4 = stream.indexOf(` ${name},`) === -1;

          const unUsedCase = case1 && case2 && case3 && case4;
          //사용하지 않는 에셋
          if (unUsedCase) {
            list += `${name} ----- ${size}\n`;
            return asset;
          }
          return null;
        })
        .filter(Boolean);

      box([list]);

      // msg("사용하지 않는 파일들을 지우길 원하시나요? (Y/N)");
      err("DO YOU WANT TO DELETE UNUSED FILES? (Y/N) [N]");
      const deletedFiles = unUsed.reduce(
        (names, { _fullFilePath }) => names.concat(_fullFilePath),
        []
      );
      box(deletedFiles.join("\n"));
      getLineInput((line) => {
        if (line.toUpperCase() === "Y") {
          unUsed.forEach(({ _fullFilePath }) => fs.unlinkSync(_fullFilePath));
          msg("FILES DELETE COMPLETE");
          process.exit();
        } else {
          process.exit();
        }
      });
    });
  } catch (e) {
    console.error(e);
    process.exit();
  }
}
