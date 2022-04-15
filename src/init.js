#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
// import readline from "readline";
// import { async } from "@babel/runtime/regenerator";
// import { err, log, msg } from "./ink";
import { createConfigFile } from "./util";

const sleep = (ms = 900) => new Promise((r) => setTimeout(r, ms));
const log = console.log;
const msg = (m) => log(chalk.greenBright(m));
const err = (m) => log(chalk.red(m));

async function welcome() {
  figlet(`Welcome to EIMA!`, (err, data) => {
    console.log(gradient.pastel.multiline(data) + "\n");
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
    message: `es ver -------------- ${options[0]}\nassets -------------- ${options[1]}\noutputPath -------------- ${options[2]}\nvariableName -------------- ${options[3]}\n`,
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
  options.push(esVersion.split("(")[0]);
  const folderPath = await questionFolderPath();
  options.push(folderPath);
  const fileToExport = await questionFileToExport();
  options.push(fileToExport);
  const variableName = await questionVariableName();
  options.push(variableName);
  const checkAnswers = await questionCheckAnswers(options);
  if (checkAnswers.toLowerCase() !== "y") {
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
    console.clear();
    const rainbowTitle = chalkAnimation.rainbow("Setup has been completed.");
    await sleep();
    rainbowTitle.stop();
    const spinner = createSpinner("").start();
    spinner.success({ text: `Starting EIMA` });
  } catch (e) {
    console.error(e);
  }
}
