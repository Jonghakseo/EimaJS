import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import * as readline from "readline";
import * as chalk from "chalk";
import boxConsole from "box-console";

import { EIMA, EIMA_ASSET_EXPORT_FILE } from "./constants";
import { ESLint } from "eslint";

const pattern = /[^ㄱ-ㅎ|가-힣\w\s]/;

export const sleep = (ms: number = 900) =>
  new Promise((r) => setTimeout(r, ms));
export const log = console.log;
// export const log = (m: string) => log(chalk.blue(m));
export const msg = (m: string) => log(chalk.greenBright(m));
export const err = (m: string) => log(chalk.red(m));
export const help = (m: string) => log(chalk.yellow(m));
export const box = (msgs: string[]) => boxConsole(msgs);

export function getLineInput(lineCb) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  rl.on("line", function (line: string) {
    rl.close();
    lineCb(line);
  });
}

// ? fs의 readDir 메소드를 promisify 하게 wrapping 합니다.
const readdir = util.promisify(fs.readdir);

// ? file List를 파싱합니다.
export async function getFileList(pathname: string, prefix: string[]) {
  const targetPath: string = prefix
    ? `${pathname}/${prefix.join("/")}`
    : pathname;

  // ? 찾으려는 폴더 경로의 전체 file Name 긁어옵니다.
  const fileNames: string[] = await readdir(targetPath);
  // ? 찾은 모든 파일에 대해 병렬적으로 프로세스 실행
  return Promise.all(
    fileNames.map((name: string) => {
      const fullFilePath: string = path.resolve(targetPath, name);
      const fileStat = fs.statSync(fullFilePath);

      // ? 숨김파일, 숨김폴더인 경우 탐색 제외
      if (name.length > 0 && name.charAt(0) === ".") return null;

      // ? 폴더인 경우 재귀 탐색
      if (fileStat.isDirectory())
        return getFileList(pathname, [...prefix, name]);

      // ? 파일인 경우만 아래 로직 진행
      if (!fileStat.isFile()) return null;

      // ? 상수명 (.) dot split
      let CONSTANTS_NAME = name.split(".")[0];
      // let CONSTANTS_NAME = name.toUpperCase().split(".")[0];
      // ? 숫자로 시작하는 파일명 캇트
      if (CONSTANTS_NAME.substr(0, 1).match(new RegExp("^[0-9]"))) {
        throw new Error(
          `[${EIMA}] A NUMBER CANNOT BE AT THE BEGINNING OF THE FILE NAME.`
        );
      }
      // ? 확장자
      const ext = path.extname(name).slice(1);
      // ? 용량 kb
      let unit = "kb";
      const rawSize = fileStat.size;
      let size = Math.round(rawSize / 1024);
      if (size > 1024) {
        size = Math.round(size / 102.4) / 10;
        unit = "mb";
      }

      // ? 상수명 선언
      let filePath = name;

      // ? prefix(depth)가 없으면 파일명이 곧 경로
      if (prefix.length > 0) {
        // ? 그렇지 않으면 경로를 포함해서 상수명 및 경로 수정
        CONSTANTS_NAME = `${prefix.join("_")}_${CONSTANTS_NAME}`;
        // .toUpperCase()}_${CONSTANTS_NAME}`;
        filePath = `${prefix.join("/")}/${name}`;
      }
      // ? resolve 처리
      return new Promise(function (resolve) {
        resolve({
          name: CONSTANTS_NAME,
          ext,
          filePath,
          size: `${size}${unit}`,
          _fullFilePath: fullFilePath,
          _rawSize: rawSize,
        });
      });
    })
  );
}

export async function getFilePathList(pathname: string, prefix: string[]) {
  const targetPath = prefix ? `${pathname}/${prefix.join("/")}` : pathname;
  const fileNames = await readdir(targetPath);

  return Promise.all(
    fileNames.map((name: string) => {
      const fullFilePath: string = path.resolve(targetPath, name);
      const fileStat = fs.statSync(fullFilePath);

      if (fileStat.isDirectory())
        return getFilePathList(pathname, [...prefix, name]);

      if (!fileStat.isFile()) return null;
      let filePath = name;

      if (prefix.length > 0) filePath = `${prefix.join("/")}/${name}`;

      return new Promise(function (resolve) {
        resolve(filePath);
      });
    })
  );
}

// 변수명 작명법에 따른 파일 이름을 만든다
export function makePascalCaseName(
  name: string,
  ext: string,
  isIncludingExt: boolean,
  filePath?: string,
  size?: number
): string {
  const nameArr = [...name];
  const constName = `${nameArr
    .map((l, idx) => {
      if (idx === 0) return l.toUpperCase();
      if (!pattern.test(l) && l.trim()) return l;
      if (pattern.test(nameArr[idx - 1])) return l.toUpperCase();
    })
    .join("")}${
    isIncludingExt ? `${ext[0].toUpperCase()}${[...ext].slice(1).join("")}` : ""
  }`;

  return constName;
}
export function makeCamelCaseName(
  name: string,
  ext: string,
  isIncludingExt: boolean,
  filePath?: string,
  size?: number
): string {
  const nameArr = [...name];
  const constName = `${nameArr
    .map((l, idx) => {
      if (idx === 0) return l.toLowerCase();
      if (nameArr[idx - 1] === "_" || nameArr[idx - 1] === "-")
        return l.toUpperCase();
      if (!pattern.test(l) && l.trim() && l !== "_" && l !== "-") return l;
      if (pattern.test(l)) return "";
    })
    .join("")}${
    isIncludingExt ? `${ext[0].toUpperCase()}${[...ext].slice(1).join("")}` : ""
  }`;

  return constName;
}
export function makeSnakeCaseName(
  name: string,
  ext: string,
  isIncludingExt: boolean,
  filePath?: string,
  size?: number
): string {
  const constName = `${[...name]
    .map((l) => {
      if (!pattern.test(l) && l.trim()) return l.toLowerCase();
      if (pattern.test(l)) return "_";
    })
    .join("")}${isIncludingExt ? `_${ext}` : ""}`;

  return constName;
}
export function makeSnakeWithUpperCaseName(
  name: string,
  ext: string,
  isIncludingExt: boolean,
  filePath?: string,
  size?: number
): string {
  const constName = `${[...name]
    .map((l) => {
      if (!pattern.test(l) && l.trim()) return l.toUpperCase();
      if (pattern.test(l)) return "_";
    })
    .join("")}${isIncludingExt ? `_${ext.toUpperCase()}` : ""}`;

  return constName;
}

// aima.json 파일을 만든다.
export async function createConfigFile({
  target,
  assetPath,
  outputPath,
  variableName,
  variableNameCasing,
  isIncludingExt,
}) {
  // export async function createConfigFile(target, assets, out, vName) {
  const configJson = {
    target,
    hideSize: false,
    isIncludingExt,
    variableNameCasing,
    lintPath: "src",
    paths: [
      {
        assets: assetPath,
        out: outputPath,
        vName: variableName,
      },
    ],
  };
  const savePath = path.resolve(process.cwd(), `eima.json`);
  fs.writeFileSync(savePath, JSON.stringify(configJson));
}

export async function fixEslint(outPath: string, ecmaVersion: number = 2015) {
  const eslint = new ESLint({
    fix: true,
    overrideConfig: {
      parserOptions: {
        ecmaVersion: ecmaVersion,
      },
    },
  });
  const result = await eslint.lintFiles([outPath]);
  await ESLint.outputFixes(result);
}

export function mergeAllSourceFile(
  path: string,
  files: string[],
  cb: Function
) {
  let stream = "";
  let count = 0;
  files.forEach((fileName: string) => {
    fs.readFile(
      `${path}${fileName}`,
      "utf-8",
      (err: NodeJS.ErrnoException, data: string) => {
        if (err) {
          throw err;
        } else {
          if (data.indexOf(EIMA_ASSET_EXPORT_FILE) === -1) {
            // 에셋파일 -> 제외
            stream += data;
          }
          count += 1;
          if (count === files.length) {
            cb(stream);
          }
        }
      }
    );
  });
}

export function getConfig(): ConfigType {
  const configPath = path.resolve(process.cwd(), "eima.json");
  let config = null;
  try {
    const configJson = JSON.parse(fs.readFileSync(configPath, "utf8"));

    if (!configJson.paths || configJson.paths.length === 0) {
      help("Please check paths property in eima.json");
    } else {
      config = configJson;
    }
  } catch (e) {
    // config 관련 에러인 경우 ignore
    if (!e.path || !e.path.includes("eima.json")) console.error(e);
  }
  return config;
}

export const getCasingType = (variableNameCasing) => {
  let getName;
  switch (variableNameCasing) {
    case "Camel":
      getName = makeCamelCaseName;
      break;
    case "Snake":
      getName = makeSnakeCaseName;
      break;
    case "Pascal":
      getName = makePascalCaseName;
      break;

    default:
      getName = makeSnakeWithUpperCaseName;
      break;
  }

  return getName;
};
