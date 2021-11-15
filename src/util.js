import path from "path";

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
      // ? 폴더인 경우 재귀 탐색
      if (checkIsFolder(name)) {
        return getFileList(pathname, [...prefix, name]);
      }
      // ? 파일인 경우
      if (checkIsFile(name)) {
        // ? 상수명 (.) dot split
        let CONSTANTS_NAME = name.toUpperCase().split(".")[0];
        // ? 확장자
        const ext = path.extname(name).slice(1);
        // ? 용량 kb
        let unit = "kb";
        let size = Math.round(
          fs.statSync(path.resolve(targetPath, name)).size / 1024
        );
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

export function checkIsFolder(fileName) {
  return fileName.indexOf(".") === -1;
}

export function checkIsFile(fileName) {
  return fileName.indexOf(".") > 0;
}

export function makeConfigFile([target, assets, out, vName]) {
  const configJson = {
    target,
    hideSize: false,
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
