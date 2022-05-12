#!/usr/bin/env node

import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import { createConfigFile } from "./util";
import { ES_VERSION, TOTAL_STEP, VARIABLE_CASING } from "./constants";
import { sleep } from "./util";

async function welcome() {
  figlet(`Welcome to EIMA!`, (err, data: string) => {
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
async function questionFolderPath(step: number) {
  const answers = await inquirer.prompt({
    name: "questionFolderPath",
    type: "input",
    message: `(${step}/${TOTAL_STEP}) Optional || Please enter the asset folder path.: \n`,
    default() {
      return "assets";
    },
  });

  return answers.questionFolderPath;
}
//
async function questionFileToExport(step: number) {
  const answers = await inquirer.prompt({
    name: "questionFileToExport",
    type: "input",
    message: `(${step}/${TOTAL_STEP}) Optional || Please specify the file you want to export.: \n`,
    default() {
      return "src/assets.js";
    },
  });

  return answers.questionFileToExport;
}

// asset들을 모아놓은 오브젝트 변수명을 무엇으로 할지 입력 받음
async function questionVariableName(step: number) {
  const answers = await inquirer.prompt({
    name: "questionVariableName",
    type: "input",
    message: `(${step}/${TOTAL_STEP}) Optional || Please specify the object's variable name that contains all assets you want to export.: \n`,
    default() {
      return "ASSETS";
    },
  });

  return answers.questionVariableName;
}

// 변수명 작성법 선택
async function questionVariableNamingType(step: number) {
  const answers = await inquirer.prompt({
    name: "questionVariableNamingType",
    type: "list",
    message: `(${step}/${TOTAL_STEP}) Optional || Please select the variable casing.: \n`,
    choices: VARIABLE_CASING,
    default() {
      return VARIABLE_CASING[VARIABLE_CASING.length - 1];
    },
  });

  return answers.questionVariableNamingType;
}
// 확장자 포함하여 이름 작명할지 여부 선택
async function questionIncludeExt(step: number) {
  const answers = await inquirer.prompt({
    name: "questionIncludeExt",
    type: "list",
    message: `(${step}/${TOTAL_STEP}) Optional || Do you want to include the ext of the file in variable name?: \n`,
    choices: ["Y", "N"],
    default() {
      return "Y";
    },
  });

  return answers.questionIncludeExt;
}

// 선택한 내용 체크
async function questionCheckAnswers(options: Options) {
  const answers = await inquirer.prompt({
    name: "questionCheckAnswers",
    message: `es ver -------------- ${options.target}\n
    assets path-------------- ${options.assetPath}\n
    output path -------------- ${options.outputPath}\n
    variable name -------------- ${options.variableName}\n
    variable casing -------------- ${options.variableNameCasing}\n
    include ext -------------- ${options.isIncludingExt}\n
    `,
    type: "list",
    choices: ["Y", "N"],
  });

  return answers.questionCheckAnswers;
}

////////////////////
export async function eimaInit() {
  let isDone: boolean = false;
  const options: Options = {
    target: "es6",
    assetPath: "",
    outputPath: "",
    variableName: "",
    variableNameCasing: "Camel",
    isIncludingExt: true,
  };

  await welcome();
  const esVersion = await questionEsVersion();
  options.target = esVersion.split("(")[0];
  const folderPath = await questionFolderPath(1);
  options.assetPath = folderPath;
  const fileToExport = await questionFileToExport(2);
  options.outputPath = fileToExport;
  const variableName = await questionVariableName(3);
  options.variableName = variableName;
  const variableNameCasing = await questionVariableNamingType(4);
  options.variableNameCasing = variableNameCasing;
  const isIncludingExt = await questionIncludeExt(5);
  options.isIncludingExt = isIncludingExt.toLowerCase() === "y" ? true : false;

  const checkAnswers = await questionCheckAnswers(options);
  if (checkAnswers.toLowerCase() !== "y") {
    const spinner = createSpinner("").start();
    spinner.error({ text: `💀💀💀 Setup has been stoped.` });
    process.exit(1);
  } else {
    isDone = true;
    const spinner = createSpinner("").start();
    spinner.success({ text: `Great job! We are almost there!` });
  }

  if (!isDone) return;

  try {
    await createConfigFile(options);
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
