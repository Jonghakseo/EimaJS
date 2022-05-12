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
