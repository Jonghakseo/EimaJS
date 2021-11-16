import { help } from "./console";
import React from "react";
import { eimaInit, eimaLint, eimaStart } from "./core";
const yargs = require("yargs");

yargs.version("0.1.8");

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
  describe: "Check unused asset variables",
  handler() {
    eimaLint();
  },
});

yargs
  .command({
    command: "*",
    handler() {
      help("Can't find command --help");
    },
  })
  .demandCommand().argv;
