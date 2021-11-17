import readline from "readline";
import { err, log, msg } from "./ink";
import { createConfigFile } from "./util";

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
        await createConfigFile(...options);
        log("Setup is complete. --> eima start");
      } catch (e) {
        console.error(e);
      }
    }
  });
}
