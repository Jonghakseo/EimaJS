// ? ecma script versions
export const ES_VERSION = {
  ES5: "es5",
  ES6: "es6",
};

export const TOTAL_STEP = 5;

export const VARIABLE_CASING = [
  "Camel",
  "Snake",
  "Kebab", //
  "Pascal", //
  "Upper with snake", //
];

export const EIMA = "EIMA";
export const EIMA_ASSET_EXPORT_FILE = "EIMA ASSET EXPORT FILE";

export const DEFAULT_CONFIG = {
  paths: [
    {
      assets: "assets",
      out: "assets.js",
      vName: "ASSETS",
    },
  ],
  lintPath: "src",
  hideSize: true,
  target: ES_VERSION.ES6,
};
