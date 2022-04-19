import path from "path";
import fs from "fs";
import util from "util";
import readline from "readline";
import { EIMA, EIMA_ASSET_EXPORT_FILE } from "./constants";
import { help } from "./ink";
import { ESLint } from "eslint";
import { async } from "@babel/runtime/regenerator";

const pattern = /[^ㄱ-ㅎ|가-힣\w\s]/;

export function getLineInput(lineCb) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  rl.on("line", function (line) {
    rl.close();
    lineCb(line);
  });
}

// ? fs의 readDir 메소드를 promisify 하게 wrapping 합니다.
const readdir = util.promisify(fs.readdir);

// ? file List를 파싱합니다.
export async function getFileList(pathname, prefix) {
  const targetPath = prefix ? `${pathname}/${prefix.join("/")}` : pathname;

  // ? 찾으려는 폴더 경로의 전체 file Name 긁어옵니다.
  const fileNames = await readdir(targetPath);
  // ? 찾은 모든 파일에 대해 병렬적으로 프로세스 실행
  return Promise.all(
    fileNames.map((name) => {
      const fullFilePath = path.resolve(targetPath, name);
      const fileStat = fs.statSync(fullFilePath);

      // ? 숨김파일, 숨김폴더인 경우 탐색 제외
      if (name.length > 0 && name.charAt(0) === ".") {
        return null;
      }
      // ? 폴더인 경우 재귀 탐색
      if (fileStat.isDirectory()) {
        return getFileList(pathname, [...prefix, name]);
      }
      // ? 파일인 경우
      if (fileStat.isFile()) {
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
      } else {
        return null;
      }
    })
  );
}

export async function getFilePathList(pathname, prefix) {
  const targetPath = prefix ? `${pathname}/${prefix.join("/")}` : pathname;

  const fileNames = await readdir(targetPath);

  return Promise.all(
    fileNames.map((name) => {
      const fullFilePath = path.resolve(targetPath, name);
      const fileStat = fs.statSync(fullFilePath);
      if (fileStat.isDirectory()) {
        return getFilePathList(pathname, [...prefix, name]);
      }
      if (fileStat.isFile()) {
        let filePath = name;

        if (prefix.length > 0) {
          filePath = `${prefix.join("/")}/${name}`;
        }
        return new Promise(function (resolve) {
          resolve(filePath);
        });
      } else {
        return null;
      }
    })
  );
}

// 변수명 작명법에 따른 파일 이름을 만든다
export function makeKebabCaseName(name, ext, filePath, size, isIncludingExt) {
  const constName = `${[...name]
    .map((l) => {
      if (!pattern.test(l) && l.trim()) return l.toLowerCase();
      if (pattern.test(l)) return "-";
    })
    .join("")}${isIncludingExt ? `-${ext}` : ""}`;

  return constName;
}
export function makePascalCaseName(name, ext, filePath, size, isIncludingExt) {
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
// export function makeUpperCaseName(name, ext, filePath, size, isIncludingExt) {
//   const constName = `${[...name]
//     .map((l) => {
//       if (!pattern.test(l) && l.trim()) return l.toUpperCase();
//       if (pattern.test(l)) return "";
//     })
//     .join("")}${isIncludingExt ? `${ext.toUpperCase()}` : ""}`;

//   return constName;
// }
export function makeCamelCaseName(name, ext, filePath, size, isIncludingExt) {
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
export function makeSnakeCaseName(name, ext, filePath, size, isIncludingExt) {
  const constName = `${[...name]
    .map((l) => {
      if (!pattern.test(l) && l.trim()) return l.toLowerCase();
      if (pattern.test(l)) return "_";
    })
    .join("")}${isIncludingExt ? `_${ext}` : ""}`;

  return constName;
}
export function makeSnakeWithUpperCaseName(
  name,
  ext,
  filePath,
  size,
  isIncludingExt
) {
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

export async function fixEslint(outPath, ecmaVersion = 2015) {
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

export function mergeAllSourceFile(path, files, cb) {
  let stream = "";
  let count = 0;
  files.forEach((fileName) => {
    fs.readFile(`${path}${fileName}`, "utf-8", (err, data) => {
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
    });
  });
}

export function getConfig() {
  const configPath = path.resolve(process.cwd(), "eima.json");
  let config = null;
  try {
    let configJson = JSON.parse(fs.readFileSync(configPath, "utf8"));

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
