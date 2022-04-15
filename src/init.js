#!/usr/bin/env node

import readline from "readline";
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import { async } from "@babel/runtime/regenerator";
// import { err, log, msg } from "./ink";
import { createConfigFile } from "./util";

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const log = console.log;
const msg = (m) => log(chalk.greenBright(m));
const err = (m) => log(chalk.red(m));

async function welcome() {
  // const rainbowTitle = chalkAnimation.rainbow("Welcome to EIMA! \n");
  // await sleep();
  // rainbowTitle.stop();
  figlet(`Welcome to EIMA!`, (err, data) => {
    console.log(gradient.pastel.multiline(data) + "\n");

    // process.exit(0);
  });
  await sleep();
}

async function questionEsVersion() {
  const answers = await inquirer.prompt({
    name: "questionEs",
    type: "list",
    message: "Please select version of ecma script: \n",
    choices: ["es5(require)", "es6(import)"],
  });

  return answers.questionEs;
}
//
async function questionFolderPath() {
  const answers = await inquirer.prompt({
    name: "questionFolderPath",
    type: "input",
    message: "(1/3) Optional || Please enter the asset folder path.: \n",
    default() {
      return "assets";
    },
  });

  return answers.questionFolderPath;
}
//
async function questionFileToExport() {
  const answers = await inquirer.prompt({
    name: "questionFileToExport",
    type: "input",
    message:
      "(2/3) Optional || Please specify the file you want to export.: \n",
    default() {
      return "src/assets.js";
    },
  });

  return answers.questionFileToExport;
}

//
async function questionVariableName() {
  const answers = await inquirer.prompt({
    name: "questionVariableName",
    type: "input",
    message:
      "(3/3) Optional || Please specify the asset variable name you want to export.: \n",
    default() {
      return "ASSETS";
    },
  });

  return answers.questionVariableName;
}

//
async function questionCheckAnswers(options) {
  const answers = await inquirer.prompt({
    name: "questionCheckAnswers",
    type: "input",
    message: `es ver -------------- ${options[0]}\n
    assets -------------- ${options[1]}\n
    outputPath -------------- ${options[2]}\n
    variableName -------------- ${options[3]}\n
    `,
    type: "list",
    choices: ["Y", "N"],
  });

  return answers.questionCheckAnswers;
}

////////////////////
export async function eimaInit() {
  let isDone = false;
  const options = [];

  await welcome();
  const esVersion = await questionEsVersion();
  options.push(esVersion);
  const folderPath = await questionFolderPath();
  options.push(folderPath);
  const fileToExport = await questionFileToExport();
  options.push(fileToExport);
  const variableName = await questionVariableName();
  options.push(variableName);
  const checkAnswers = await questionCheckAnswers(options);
  if (checkAnswers.toLowerCase() !== "y") {
    // err("Stop setting up");
    const spinner = createSpinner("").start();
    spinner.error({ text: `💀💀💀 Set up stoped.` });
    process.exit(1);
  } else {
    isDone = true;
    const spinner = createSpinner("").start();
    spinner.success({ text: `Great job! We are almost there!` });
  }

  if (!isDone) return;
  try {
    await createConfigFile(...options);
    // log("Setup is complete. --> eima start");
    console.clear();
    // figlet(`Setup is complete.\n  --> eima start`, (err, data) => {
    //   console.log(gradient.pastel.multiline(data) + "\n");
    //   // process.exit(0);
    // });
    const rainbowTitle = chalkAnimation.rainbow("Setup has been completed.");
    await sleep();
    rainbowTitle.stop();
    const spinner = createSpinner("").start();
    spinner.success({ text: `Starting EIMA` });
  } catch (e) {
    console.error(e);
  }
}

// export async function eimaInit() {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     terminal: false,
//   });

//   const options = [];

//   msg("Please select version of ecma script: es5(require)/es6(import) [es6]");

//   let isDone = false;

//   rl.on("line", function (line) {
//     let input = line;
//     if (line.slice() === "/") {
//       err("THE FIRST SLASH ON THE PATH IS NOT AVAILABLE.");
//       process.exit();
//     }

//     switch (options.length) {
//       case 0:
//         input = line || "es6";
//         if (input === "es6" || input === "es5") {
//           options.push(input);
//           msg("(1/3) Optional || Please enter the asset folder path. [assets]");
//           break;
//         } else {
//           msg("Error: Only 2 values(es5/es6) can be received");
//           return process.exit();
//         }
//       case 1:
//         input = line || "assets";
//         options.push(input);
//         msg(
//           "(2/3) Optional || Please specify the file you want to export. [src/assets.js]"
//         );
//         break;
//       case 2:
//         input = line || "src/assets.js";
//         options.push(input);
//         msg(
//           "(3/3) Optional || Please specify the asset variable name you want to export. [ASSETS]"
//         );
//         break;
//       case 3:
//         input = line || "ASSETS";
//         options.push(input);
//         const text = `Do you wanna start with the current settings? [Y/N]
//             es ver -------------- ${options[0]}
//             assets -------------- ${options[1]}
//             outPath ------------- ${options[2]}
//             variableName -------- ${options[3]}
//     `;
//         msg(text);
//         break;

//       // last step
//       case 4:
//         if (line.toLowerCase() !== "y") {
//           err("Stop setting up");
//           process.exit();
//         } else {
//           isDone = true;
//           rl.close();
//         }
//         break;
//     }
//   }).on("close", async function () {
//     if (!isDone) return;
//     try {
//       await createConfigFile(...options);
//       log("Setup is complete. --> eima start");
//     } catch (e) {
//       console.error(e);
//     }
//   });
// }
