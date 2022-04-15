#!/usr/bin/env node
"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_typeof=require("@babel/runtime/helpers/typeof");Object.defineProperty(exports,"__esModule",{value:!0}),exports.eimaInit=eimaInit;var _regenerator=_interopRequireWildcard(require("@babel/runtime/regenerator")),_defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_readline=_interopRequireDefault(require("readline")),_chalk=_interopRequireDefault(require("chalk")),_inquirer=_interopRequireDefault(require("inquirer")),_gradientString=_interopRequireDefault(require("gradient-string")),_chalkAnimation=_interopRequireDefault(require("chalk-animation")),_figlet=_interopRequireDefault(require("figlet")),_nanospinner=require("nanospinner"),_util=require("./util");function _getRequireWildcardCache(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(_getRequireWildcardCache=function(a){return a?c:b})(a)}function _interopRequireWildcard(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!==_typeof(a)&&"function"!=typeof a)return{default:a};var c=_getRequireWildcardCache(b);if(c&&c.has(a))return c.get(a);var d={},e=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var f in a)if("default"!=f&&Object.prototype.hasOwnProperty.call(a,f)){var g=e?Object.getOwnPropertyDescriptor(a,f):null;g&&(g.get||g.set)?Object.defineProperty(d,f,g):d[f]=a[f]}return d["default"]=a,c&&c.set(a,d),d}var sleep=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:1e3;return new Promise(function(b){return setTimeout(b,a)})},log=console.log,msg=function(a){return log(_chalk["default"].greenBright(a))},err=function(a){return log(_chalk["default"].red(a))};function welcome(){return _welcome.apply(this,arguments)}function _welcome(){return _welcome=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(){return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return(0,_figlet["default"])("Welcome to EIMA!",function(a,b){console.log(_gradientString["default"].pastel.multiline(b)+"\n")}),a.next=3,sleep();case 3:case"end":return a.stop();}},a)})),_welcome.apply(this,arguments)}function questionEsVersion(){return _questionEsVersion.apply(this,arguments)}function _questionEsVersion(){return _questionEsVersion=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(){var b;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,_inquirer["default"].prompt({name:"questionEs",type:"list",message:"Please select version of ecma script: \n",choices:["es5(require)","es6(import)"]});case 2:return b=a.sent,a.abrupt("return",b.questionEs);case 4:case"end":return a.stop();}},a)})),_questionEsVersion.apply(this,arguments)}function questionFolderPath(){return _questionFolderPath.apply(this,arguments)}function _questionFolderPath(){return _questionFolderPath=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(){var b;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,_inquirer["default"].prompt({name:"questionFolderPath",type:"input",message:"(1/3) Optional || Please enter the asset folder path.: \n",default:function(){return"assets"}});case 2:return b=a.sent,a.abrupt("return",b.questionFolderPath);case 4:case"end":return a.stop();}},a)})),_questionFolderPath.apply(this,arguments)}function questionFileToExport(){return _questionFileToExport.apply(this,arguments)}function _questionFileToExport(){return _questionFileToExport=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(){var b;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,_inquirer["default"].prompt({name:"questionFileToExport",type:"input",message:"(2/3) Optional || Please specify the file you want to export.: \n",default:function(){return"src/assets.js"}});case 2:return b=a.sent,a.abrupt("return",b.questionFileToExport);case 4:case"end":return a.stop();}},a)})),_questionFileToExport.apply(this,arguments)}function questionVariableName(){return _questionVariableName.apply(this,arguments)}function _questionVariableName(){return _questionVariableName=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(){var b;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,_inquirer["default"].prompt({name:"questionVariableName",type:"input",message:"(3/3) Optional || Please specify the asset variable name you want to export.: \n",default:function(){return"ASSETS"}});case 2:return b=a.sent,a.abrupt("return",b.questionVariableName);case 4:case"end":return a.stop();}},a)})),_questionVariableName.apply(this,arguments)}function questionCheckAnswers(){return _questionCheckAnswers.apply(this,arguments)}function _questionCheckAnswers(){return _questionCheckAnswers=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function b(a){var c,d;return _regenerator["default"].wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.next=2,_inquirer["default"].prompt((c={name:"questionCheckAnswers",type:"input",message:"es ver -------------- ".concat(a[0],"\n\n    assets -------------- ").concat(a[1],"\n\n    outputPath -------------- ").concat(a[2],"\n\n    variableName -------------- ").concat(a[3],"\n\n    ")},(0,_defineProperty2["default"])(c,"type","list"),(0,_defineProperty2["default"])(c,"choices",["Y","N"]),c));case 2:return d=b.sent,b.abrupt("return",d.questionCheckAnswers);case 4:case"end":return b.stop();}},b)})),_questionCheckAnswers.apply(this,arguments)}function eimaInit(){return _eimaInit.apply(this,arguments)}function _eimaInit(){return _eimaInit=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(){var b,c,d,e,f,g,h,i,j,k,l;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return b=!1,c=[],a.next=4,welcome();case 4:return a.next=6,questionEsVersion();case 6:return d=a.sent,c.push(d),a.next=10,questionFolderPath();case 10:return e=a.sent,c.push(e),a.next=14,questionFileToExport();case 14:return f=a.sent,c.push(f),a.next=18,questionVariableName();case 18:return g=a.sent,c.push(g),a.next=22,questionCheckAnswers(c);case 22:if(h=a.sent,"y"===h.toLowerCase()?(b=!0,j=(0,_nanospinner.createSpinner)("").start(),j.success({text:"Great job! We are almost there!"})):(i=(0,_nanospinner.createSpinner)("").start(),i.error({text:"\uD83D\uDC80\uD83D\uDC80\uD83D\uDC80 Set up stoped."}),process.exit(1)),b){a.next=26;break}return a.abrupt("return");case 26:return a.prev=26,a.next=29,_util.createConfigFile.apply(void 0,c);case 29:return console.clear(),k=_chalkAnimation["default"].rainbow("Setup has been completed."),a.next=33,sleep();case 33:k.stop(),l=(0,_nanospinner.createSpinner)("").start(),l.success({text:"Starting EIMA"}),a.next=41;break;case 38:a.prev=38,a.t0=a["catch"](26),console.error(a.t0);case 41:case"end":return a.stop();}},a,null,[[26,38]])})),_eimaInit.apply(this,arguments)}