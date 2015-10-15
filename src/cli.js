import minimist from "minimist";

import path from "path";
import Logger from "./logger" ;

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

  return {
    config : processConfig(dataCLI.config) || defaultConfig,
    input : dataCLI._[0]
  };
}

/*cli
  .usage("<file or glob pattern> [options]")
  .version(process.env.npm_package_version)
  .option("-C, --config <file>", "config file")
  .option("-s, --silent", "no output")
  .option("-v, --verboseLvl <n>", "Select a level between 0 (silent) and 4 (debug). Default to 2 ",parseInt,VERBOSE_LVLS.INFORMATIVE)
  .parse(process.argv);*/









function processConfig(configFile) {
  if(!configFile) {
    Logger.infoPlus("trying to load the default config file...");
    configFile = "codemetrics.config.js";
  }
  //TODO valid configuration
  return loadConfigFile(configFile);
}


function loadConfigFile(configFile) {
  var config;
  try {
    config = require(path.resolve(configFile));
    Logger.debug("config => "+config);
  } catch (e) {

    Logger.warning("Can't load the config file ( " + configFile + " )", e);
    Logger.warning("Loading default config");
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