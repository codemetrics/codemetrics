import cli from "commander";
import path from "path";
import Logger from "./logger" ;

const VERBOSE_LVLS = {
  NO_OUTPUT: 0,
  MINIMAL: 1,
  INFORMATIVE: 2,
  TALKATIVE: 3,
  DEBUG: 4
};

const dataCLI = cli
  .version("0.0.1")
  .option("-C, --config <file>", "config file")
  .option("-s, --silent", "no output")
  .option("-v, --verboseLvl", "tell me what you do", VERBOSE_LVLS.INFORMATIVE)
  .parse(process.argv);


export const config = processConfig(dataCLI.config);

console.log(dataCLI.verbose);
Logger.setVerboseLevel(dataCLI.verbose);

export const input = dataCLI.args[0];
/*
if(!program.args.length) {
    program.help();
} else {
    console.log('Keywords: ' + program.args);
}*/
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



function processConfig(configFile) {
  //TODO valid configuration
  return configFile ? loadConfigFile(configFile) : defaultConfig;
}


function loadConfigFile(configFile) {
  var config;
  try {
    config = require(path.resolve(configFile));
  } catch (e) {

    Logger.warning("Can't load the config file ( " + configFile + " )", e);
    process.exit(1);
  }
  return config;
}
