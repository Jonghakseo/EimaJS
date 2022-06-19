"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
// import { help } from "./ink.js";
var init_1 = require("./init");
var start_1 = require("./start");
var lint_1 = require("./lint");
var util_1 = require("./util");
yargs.help("help").alias("h", "help");
yargs.version("0.2.12").alias("v", "version");
yargs.command({
    command: "init",
    describe: "Init eima",
    handler: function () {
        (0, init_1.eimaInit)();
    },
});
yargs.command({
    command: "start",
    describe: "Monitor assets and reflect changes",
    handler: function () {
        (0, start_1.eimaStart)();
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
    handler: function (_a) {
        var path = _a.path;
        void (0, lint_1.eimaLint)(path);
    },
});
yargs
    .command({
    command: "*",
    handler: function () {
        (0, util_1.help)("No Commands Found.");
        yargs.showHelp();
    },
})
    .demandCommand().argv;
