import minimist from "minimist";

import path from "path";
import Logger from "./logger" ;
import Table from "cli-table";

const VERBOSE_LVLS = {
  NO_OUTPUT: 0,
  MINIMAL: 1,
  INFORMATIVE: 2,
  TALKATIVE: 3,
  DEBUG: 4
};


const defaultConfig = {
  parsers: [{
    name: "file"
  }],
  processors: [{
    name: "sloc"
  }],
  reporters: [{
    name: "console"
  }]
};


export default function run(){

  const dataCLI = minimist(process.argv.slice(2));

  if (!dataCLI._.length) {
    Logger.error("You must provide an input");
    displayHelp();
    process.exit(1);
  }
  if(dataCLI._.length>1){
    Logger.error("Invalid input");
    displayHelp();
    process.exit(1);
  }


  if(!isNaN(dataCLI.v)){
    Logger.setVerboseLevel(parseInt(dataCLI.v,10));
    Logger.debug("Set verbose LVL to "+ dataCLI.v);
  } else {
    Logger.setVerboseLevel(VERBOSE_LVLS.INFORMATIVE);
  }

  const config = processConfig(dataCLI.C || dataCLI.config) || defaultConfig ;
  displayTable(config);

  return {
    config,
    input : dataCLI._[0]
  };
}


function processConfig(configFile) {
  if(!configFile) {
    Logger.infoPlus("* Trying to load the default config file...");
    configFile = "codemetrics.config.js";
  }
  //TODO valid configuration
  return loadConfigFile(configFile);
}


function loadConfigFile(configFile) {
  var config;
  try {
    config = require(path.resolve(configFile));
    Logger.debug("config => ");
    Logger.debug(config);
  } catch (e) {

    Logger.warning("Can't load the config file ( " + configFile + " )", true);
    Logger.warning(e);
    Logger.warning("* Loading default config");
    //process.exit(1);

  }
  return config;
}

function displayHelp(){
  return `
  Usage: src <file or glob pattern> [options]

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    -C, --config <file>   config file
    -s, --silent          no output
    --verboseLvl <n>  Select a level between 0 (silent) and 4 (debug). Default to 2
    `;
}

function displayTable(config) {
  // instantiate
  var summary = new Table({
    head: ["Parsers", "Processors","Reporters"]
  });

  var i = 0 ;
  while(config.parsers[i] !== undefined || config.processors[i] !== undefined, config.reporters[i] !== undefined){
    summary.push([
      config.parsers[i] !== undefined ? config.parsers[i].name : "",
      config.processors[i] !== undefined ? config.processors[i].name : "",
      config.reporters[i] !== undefined ? config.reporters[i].name : ""]
      );
    i++;
  }


  console.log(summary.toString());

}

