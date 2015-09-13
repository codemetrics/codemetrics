/* global process */
"use strict";

const Logger = require("./logger.js");

const path = require("path");
const cli = require("commander");


const Codemetrics = require("./codemetrics.js");
const handlePluginHelper = require("./handlePluginHelper.js");


const defaultConfig = {
    parsers : [{
      name:"file"
    }],
    processors : [{
      name:"sloc"
    }],
    reporters : [{
      name:"console"
    }]
};



const defaultConfigFile = "./codemetrics.config.js";



//TODO provide cli input only when used with nodejs

cli
  .version('0.0.1')
  .option("-C, --config <file>", "config file")
  .option("-v, --verbose", "tell me what you do")
  .parse(process.argv);


const config = processConfig(cli.config);
const verbose = cli.verbose ? cli.verbose : true;
const input = cli.args[0] ;
  //TODO check input
//console.log(config,cli.args);

var parsers,processors,reporters;





//TODO provide ability to handle multiples parsers
//TODO parsers could be piped
handlePlugins(config.parsers,"parser",{})
  //.then((result) => {parsers = result})
  //TODO Fix the name processor > process
  .then((plugins) => handlePlugins(config.processors,"process",plugins))
  //.then((result) => {processors = result})
  .then((plugins) => handlePlugins(config.reporters,"reporter",plugins))
  //.then((result) => {reporters = result})
  .then((plugins) => {
    new Codemetrics(input,verbose)
    .parse(plugins.parser)
    .process(plugins.processor)
    .report(plugins.reporter) ;
  })

/*
const processors = config.processors.map(processor => handlePlugin(processor,"process"));
const reporters= config.reporters.map(reporter => handlePlugin(reporter,"reporter"));

*/
function handlePlugins(configListePlugins,type, plugins){
  Logger.load(type,Logger.LOG_LVLS.LOADING);
  return Promise.all(configListePlugins.map((plugin) => handlePluginHelper(plugin,type)))
  .then((result) => {
    Logger.load(type,Logger.LOG_LVLS.SUCCESS);


    //todo rename process > processor
    if(type === "process") {
      type="processor";
    }
    plugins[type] = result;
    return plugins;
  })
  .catch( (result = {msg,errorMsg} ) => {

    Logger.error(result.msg);

    if(result.errorMsg){
      Logger.bigError(result.errorMsg);
    }
    process.exit(1);
  });
}




/*
if(!program.args.length) {
    program.help();
} else {
    console.log('Keywords: ' + program.args);
}
*/





function processConfig(CLIconfig){
  return CLIconfig ? require(path.resolve(CLIconfig)) : loadDefaultConfig() ;
}


function loadDefaultConfig(){
  var config  ;
  try {
    config = require(path.resolve(defaultConfigFile));
    //TODO valid configuration
    Logger.info("Using configuration file") ;
  } catch(e) {
    Logger.error("No configuration provided") ;

    process.exit(1);
  }
  return config;
}

