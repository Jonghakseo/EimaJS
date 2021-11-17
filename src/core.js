import {
  getConfig,
  getFileList,
  getFileListLite,
  makeInitConfigFile,
  mergeAllSourceFile,
} from "./util";
import { box, err, help, log, msg } from "./console";
import { DEFAULT_CONFIG, ES_VERSION } from "./constants";
import { assetsToImportFile } from "./assetsToImportFile";
import readline from "readline";

export function eimaInit() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  let options = [];
  msg("Please select version of ecma script: es5(require)/es6(import) [es6]");
  let isDone = false;
  rl.on("line", function (line) {
    let input = line;
    if (line.slice() === "/") {
      err("THE FIRST SLASH ON THE PATH IS NOT AVAILABLE.");
      process.exit();
    }
    switch (options.length) {
      case 0:
        input = line || "es6";
        if (input === "es6" || input === "es5") {
          options.push(input);
          msg("(1/3) Optional || Please enter the asset folder path. [assets]");
          break;
        } else {
          msg("Error: Only 2 values(es5/es6) can be received");
          return process.exit();
        }
      case 1:
        input = line || "assets";
        options.push(input);
        msg(
          "(2/3) Optional || Please specify the file you want to export. [src/assets.js]"
        );
        break;
      case 2:
        input = line || "src/assets.js";
        options.push(input);
        msg(
          "(3/3) Optional || Please specify the asset variable name you want to export. [ASSETS]"
        );
        break;
      case 3:
        input = line || "ASSETS";
        options.push(input);
        const text = `Do you wanna start with the current settings? [Y/N]
            es ver -------------- ${options[0]}
            assets -------------- ${options[1]}
            outPath ------------- ${options[2]}
            variableName -------- ${options[3]}
    `;
        msg(text);
        break;
      case 4:
        if (line === "Y" || line === "y") {
          isDone = true;
          rl.close();
        } else {
          err("Stop setting up");
          process.exit();
        }
        break;
    }
  }).on("close", async function () {
    if (isDone) {
      try {
        await makeInitConfigFile(...options);
        log("Setup is complete. --> eima start");
      } catch (e) {
        console.error(e);
      }
    }
  });
}

export function eimaStart() {
  const configJson = getConfig();
  const config = configJson || DEFAULT_CONFIG;
  if (!configJson) {
    msg("Could not be found or read eima.json. Operate in simple mode.");
  } else {
    log("eima.json Has been found.");
  }

  if (!(config.target === ES_VERSION.ES5 || config.target === ES_VERSION.ES6)) {
    err("Please check the target ecma script version in eima.json. (es5/es6)");
    process.exit();
  }

  config.paths.forEach((path) => {
    assetsToImportFile(path, config);
  });
}

export async function eimaLint(path) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  if (!path) {
    return err(
      "The Lint Feature Requires The Folder Path You Want To Search To. Please Check Path Argument."
    );
  }
  help(
    "The Lint Feature Is Experimental And The Results May Not Be Accurate. Do You Still Want To Run It? (Y/N)"
  );
  rl.on("line", function (line) {
    if (line === "Y" || line === "y") {
      assetLint(path);
    } else {
      process.exit();
    }
  });
}

async function assetLint(path) {
  const config = getConfig();
  if (config) {
    const fileListPromise = await Promise.all(
      config.paths.map(({ assets }) => getFileList(assets, []))
    );

    const importNames = fileListPromise
      .flat(Infinity)
      .map(({ name, ext, filePath, size }) => {
        const constName =
          name.replace(/[^\w\s]/gim, "_") + "_" + ext.toUpperCase();

        return { name: constName, filePath, size };
      });

    const fileLists = await getFileListLite(__dirname, [`${path}`]);
    const filePaths = fileLists.filter(Boolean).flat(Infinity);
    mergeAllSourceFile(filePaths, (stream) => {
      let list = "EIMA ASSET LINT(ALPHA)\n\n--LIST OF NON IN-USE ASSETS--\n\n";
      importNames.forEach((asset) => {
        const { name, size, filePath } = asset;

        const case1 = stream.indexOf(`.${name}`) === -1;
        const case2 = stream.indexOf(`{${name}`) === -1;
        const case3 = stream.indexOf(`{ ${name}`) === -1;
        const case4 = stream.indexOf(` ${name},`) === -1;

        const unUsedCase = case1 && case2 && case3 && case4;
        //사용하지 않는 에셋
        if (unUsedCase) {
          list += `${name} ----- ${size}\n`;
        }
      });

      box(list);
      process.exit();
    });
  } else {
    err("Please Check eima.json");
    process.exit();
  }
}
