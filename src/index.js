import { mergeAllSourceFile, getFileListLite, makeConfigFile } from "./util";
import { help } from "./console";
import { CONFIG_MODE, ES_VERSION, SIMPLE_MODE } from "./constants";
import React from "react";

const { msg, log } = require("./console");
const { assetsToImportFile } = require("./assetsToImportFile");

const fs = require("fs");
const path = require("path");
const yargs = require("yargs");

yargs.version("0.1.8");

yargs.command({
  command: "init",
  describe: "Init eima",
  handler() {
    // render(<InitialApp />);
    initial();
  },
});

yargs.command({
  command: "start",
  describe: "Monitor assets and reflect changes",
  builder: {
    assets: {
      describe: "assets folder path",
      demandOption: false,
      type: "string",
    },
    out: {
      describe: "assets.js file path",
      demandOption: false,
      type: "string",
    },
  },
  handler(args) {
    start(args.assets, args.out);
  },
});

yargs.command({
  command: "lint",
  describe: "Check unused asset variables",
  handler() {
    lint();
  },
});

yargs
  .command({
    command: "*",
    handler() {
      help("Can't find command --help");
    },
  })
  .demandCommand().argv;

function initial() {
  const readline = require("readline");
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
          msg("Stop setting up");
          process.exit();
        }
        break;
    }
  }).on("close", async function () {
    if (isDone) {
      try {
        await makeConfigFile(options);
        log("Setup is complete. --> eima start");
      } catch (e) {
        console.error(e);
      }
    }
  });
}

function start(assetDirectory, outPath) {
  const assetDir = assetDirectory || "assets";
  const outFile = outPath || "assets.js";

  const configPath = path.resolve(process.cwd(), "eima.json");

  let config = null;
  let mode = SIMPLE_MODE;

  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    if (!config.paths || config.paths.length === 0) {
      help("Please check paths property in eima.json");
    } else {
      mode = CONFIG_MODE;
    }
  } catch (e) {
    // config 관련 에러인 경우 ignore
    if (!e.path || !e.path.includes("eima.json")) console.error(e);
  }

  if (mode === SIMPLE_MODE) {
    msg("Could not be found or read eima.json. Operate in simple mode.");
    assetsToImportFile({ assetDir, outFile });
  }

  if (mode === CONFIG_MODE) {
    log("eima.json has been found.");
    const { target } = { ...config };
    if (target !== ES_VERSION.ES5 && target !== ES_VERSION.ES6) {
      help(
        "Please check the target ecma script version in eima.json. (es5/es6)"
      );
    } else {
      if (!target) {
        config.target = ES_VERSION.ES6;
      }
      config.paths.forEach(({ assets, out, vName }) => {
        assetsToImportFile({ assetDir: assets, outFile: out, vName }, config);
      });
    }
  }
}

async function lint() {
  // const assetVariableList =
  const fileLists = await getFileListLite(__dirname, ["test"]);
  const filePaths = fileLists.filter(Boolean).flat(Infinity);
  mergeAllSourceFile(filePaths, (stream) => {
    console.log(stream);
  });
}
