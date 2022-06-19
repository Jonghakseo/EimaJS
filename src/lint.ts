import * as fs from "fs";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";

import {
  getConfig,
  getFileList,
  getFilePathList,
  mergeAllSourceFile,
  err,
  msg,
  box,
  getCasingType,
} from "./util";

export async function eimaLint(path) {
  const answer = await inquirer.prompt({
    name: "experimental",
    type: "list",
    message:
      "The Lint Feature Is Experimental And The Results May Not Be Accurate. Do You Still Want To Run It? (Y/N) [N]",
    choices: ["Y", "N"],
    default() {
      return "Y";
    },
  });

  if (answer.experimental === "Y") assetLint(path);
  else process.exit();
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
      console.log({ asset });

      const returnNewName = getCasingType(config.variableNameCasing);

      const constName =
        // TODO: 선택한 케이스로 바꿔줘야 함
        name.replace(/[^\w\s]/gim, "_") + "_" + ext.toUpperCase();
      //  getname(name, ext, config.asstes, size, config.isIncludingExt);

      return { ...asset, name: constName };
    });

    const path = `${pathParam || config.lintPath}`;
    const fileLists = await getFilePathList(path, [""]);
    const filePaths = fileLists.filter(Boolean).flat(Infinity);
    mergeAllSourceFile(path, filePaths, async (stream) => {
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

      const answer = await inquirer.prompt({
        name: "delete",
        type: "list",
        message: "DO YOU WANT TO DELETE UNUSED FILES? 🗑️",
        choices: ["Y", "N"],
        default() {
          return "N";
        },
      });

      const deletedFiles = unUsed.reduce(
        (names, { _fullFilePath }) => names.concat(_fullFilePath),
        []
      );
      box(deletedFiles.join("\n"));

      if (answer.delete === "Y") {
        const spinner = createSpinner("").start();
        unUsed.forEach(({ _fullFilePath }) => fs.unlinkSync(_fullFilePath));
        spinner.success({ text: `UNUSED FILES DELETED ✅` });
      }
      process.exit();
    });
  } catch (e) {
    console.error(e);
    process.exit();
  }
}
