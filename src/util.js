import path from "path";
import { CONFIG_MODE, EIMA_ASSET_EXPORT_FILE } from "./constants";
import { help } from "./console";
const { ESLint } = require("eslint");
const fs = require("fs");
const util = require("util");

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
      // ? 폴더인 경우 재귀 탐색
      if (fileStat.isDirectory()) {
        return getFileList(pathname, [...prefix, name]);
      }
      // ? 파일인 경우
      if (fileStat.isFile()) {
        // ? 상수명 (.) dot split
        let CONSTANTS_NAME = name.toUpperCase().split(".")[0];
        // ? 확장자
        const ext = path.extname(name).slice(1);
        // ? 용량 kb
        let unit = "kb";
        let size = Math.round(fileStat.size / 1024);
        if (size > 1024) {
          size = Math.round(size / 102.4) / 10;
          unit = "mb";
        }

        // ? 상수명 선언
        let filePath = name;

        // ? prefix(depth)가 없으면 파일명이 곧 경로
        if (prefix.length > 0) {
          // ? 그렇지 않으면 경로를 포함해서 상수명 및 경로 수정
          CONSTANTS_NAME = `${prefix
            .join("_")
            .toUpperCase()}_${CONSTANTS_NAME}`;
          filePath = `${prefix.join("/")}/${name}`;
        }
        // ? resolve 처리
        return new Promise(function (resolve) {
          resolve({
            name: CONSTANTS_NAME,
            ext,
            filePath,
            size: `${size}${unit}`,
          });
        });
      } else {
        return null;
      }
    })
  );
}

export async function getFileListLite(pathname, prefix) {
  const targetPath = prefix ? `${pathname}/${prefix.join("/")}` : pathname;

  const fileNames = await readdir(targetPath);

  return Promise.all(
    fileNames.map((name) => {
      const fullFilePath = path.resolve(targetPath, name);
      const fileStat = fs.statSync(fullFilePath);
      if (fileStat.isDirectory()) {
        return getFileListLite(pathname, [...prefix, name]);
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

export async function makeInitConfigFile(target, assets, out, vName) {
  const configJson = {
    target,
    hideSize: false,
    lintPath: "src",
    paths: [
      {
        assets,
        out,
        vName,
      },
    ],
  };
  const savePath = path.resolve(process.cwd(), `eima.json`);
  fs.writeFileSync(savePath, JSON.stringify(configJson));
}

export async function runEslint(outPath, ecmaVersion = 2015) {
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

export function mergeAllSourceFile(files, cb) {
  let stream = "";
  let count = 0;
  files.forEach((fileName) => {
    fs.readFile(fileName, "utf-8", (err, data) => {
      if (err) {
        console.error(err);
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
