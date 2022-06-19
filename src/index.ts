import React from "react";
import * as yargs from "yargs";
// import { help } from "./ink.js";
import { eimaInit } from "./init";
import { eimaStart } from "./start";
import { eimaLint } from "./lint";
import { help } from "./util";

yargs.help("help").alias("h", "help");
yargs.version("0.2.12").alias("v", "version");

yargs.command({
  command: "init",
  describe: "Init eima",
  handler() {
    eimaInit();
  },
});

yargs.command({
  command: "start",
  describe: "Monitor assets and reflect changes",
  handler() {
    eimaStart();
  },
});

yargs.command({
  command: "lint",
  describe: "Check unused asset variables. Use with -p ${target path}",
  builder: {
    path: {
      alias: "p",
      desc: "Lint target path",
      nargs: 1,
      type: "string",
    },
  },
  handler({ path }) {
    void eimaLint(path);
  },
});

yargs
  .command({
    command: "*",
    handler() {
      help("No Commands Found.");
      yargs.showHelp();
    },
  })
  .demandCommand().argv;
