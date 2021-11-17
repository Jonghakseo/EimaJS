import { help } from "./console";
import React from "react";
import { eimaInit, eimaLint, eimaStart } from "./core";
const yargs = require("yargs");

yargs.help("help").alias("h", "help");
yargs.version("0.2.0").alias("v", "version");

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
  desc: "Check unused asset variables. Use with -p ${target path}",
  builder: {
    path: {
      alias: "p",
      desc: "Lint target path",
      demandOption: true,
      nargs: 1,
      type: "string",
    },
  },
  handler(args) {
    eimaLint(args.path);
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
