"use strict";

const logSymbols = require("log-symbols");
const clor = require("clor");

const LOG_LVLS = {
  LOADING : 0,
  SUCCESS : 1
};


const PLUGINS_TYPES_NAMES = {
  parser : "parsers",
  reporter : "reporters",
  process : "processors"
};

const logLoad = {
  [LOG_LVLS.LOADING] : (type) => log({message:"Loading " +PLUGINS_TYPES_NAMES[type]+"... "}),
  [LOG_LVLS.SUCCESS] : (type) => log({message:logSymbols.success,newLine:true})
}

module.exports = {
  log,
  error   : (message) => log({message,color:"red",verboseLvl:0,newLine:true}),
  warning : (message) => log({message,color:"yellow",verboseLvl:1,newLine:true}),
  info    : (message) => log({message,color:"blue",verboseLvl:1,newLine:true}),
  load    : (type, status) => logLoad[status](type),
  bigError, // helper may change ( FATAL lvl)? )
  LOG_LVLS
};


function log({message, color=null, verboseLvl=1,newLine=false}={}) {
  if (verboseLvl) {
    message = color ? clor[color](message).toString() : message;
    message += newLine ? "\n" : "" ;
    process.stdout.write(message);
    // process.stdout.write(message + newLine ? "\n" : "");
  }
}


function bigError(message) {
  console.log(clor.line.bold.red("Error : ").line(message).toString());
}
