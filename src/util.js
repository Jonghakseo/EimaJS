import path from "path";

const fs = require("fs");
const util = require("util");

// fs의 readDir 메소드를 promisify 하게 wrapping 합니다.
const readdir = util.promisify(fs.readdir);

// file List를 파싱합니다.
export async function getFileList(pathname, prefix) {
  // 찾으려는 폴더 경로의 전체 file Name 긁어옵니다.
  const fileNames = await readdir(
    prefix ? `${pathname}/${prefix.join("/")}` : pathname
  );
  // 찾은 모든 파일에 대해 병렬적으로 프로세스 실행
  return Promise.all(
    fileNames.map((name) => {
      if (checkIsFolder(name)) {
        // 폴더인 경우 재귀 탐색
        return getFileList(pathname, [...prefix, name]);
      }
      if (checkIsFile(name)) {
        // 파일인 경우
        let CONSTANTS_NAME = name.toUpperCase().split(".")[0];
        // 상수명 선언
        let filePath = name;
        // prefix(depth)가 없으면 파일명이 곧 경로
        if (prefix.length > 0) {
          // 그렇지 않으면 경로를 포함해서 상수명 및 경로 수정
          CONSTANTS_NAME = `${prefix
            .join("_")
            .toUpperCase()}_${CONSTANTS_NAME}`;
          filePath = `${prefix.join("/")}/${name}`;
        }
        // resolve 처리
        return new Promise(function (resolve) {
          resolve({ name: CONSTANTS_NAME, filePath });
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

export function makeConfigFile(baseConfigArray) {
  const configJson = {
    paths: [
      {
        assets: baseConfigArray[0],
        out: baseConfigArray[1],
        vName: baseConfigArray[2],
      },
    ],
  };
  const savePath = path.resolve(process.cwd(), `eima.json`);
  fs.writeFileSync(savePath, JSON.stringify(configJson));
}
