type EsVersion = "es5" | "es6";
type VariableNameCasing = "Camel" | "Snake" | "Pascal" | "Upper with snake";
type Options = {
  target: string;
  assetPath: string;
  outputPath: string;
  variableName: string;
  variableNameCasing: VariableNameCasing;
  isIncludingExt: boolean;
};

type PathType = {
  assets: string;
  out: string;
  vName: string;
};
type ConfigType = {
  target: string;
  hideSize: boolean;
  isIncludingExt: boolean;
  variableNameCasing: VariableNameCasing;
  lintPath: string;
  paths: PathType[];
};

type AssetType = {
  name: string;
  size: string | number;
};
