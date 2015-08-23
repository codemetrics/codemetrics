/* global process */
"use strict";

const path = require("path");
const cli = require("commander");
const clor = require("clor");

const logSymbols = require("log-symbols");

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

//TODO parametrics keys
var PLUGINS_TYPES_NAMES = {
  parser : "parsers",
  reporter : "reporters",
  process : "processors"
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
  logLoad(type,0);
  return Promise.all(configListePlugins.map(plugin=>handlePluginHelper(plugin,type)))
  .then((result) => {
    logLoad(type,1);

    //todo rename process > processor
    if(type === "process") {
      type="processor";
    }
    plugins[type] = result;
    return plugins;
  })
  .catch( (result = {msg,errorMsg} ) => {
    logError(result.msg);
    if(result.errorMsg){
      logError(clor.line.bold.red("Error : ").line(result.errorMsg).toString());
    }
    process.exit(1);
  });
}



//TODO cst for status
function logLoad(type,status){
  if( status === 0) {
    log({message:"Loading " +PLUGINS_TYPES_NAMES[type]+"... "});
  }
  if( status === 1) {
    log({message:logSymbols.success,newLine:true});
  }
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
    logInfo("Using configuration file") ;
  } catch(e) {
    logError("No configuration provided") ;

    process.exit(1);
  }
  return config;
}




function logError(message){
  log({message,color:"red",verboseLvl:0,newLine:true});
}
function logWarning(message){
  log({message,color:"yellow",verboseLvl:1,newLine:true});
}
function logInfo(message){
  log({message,color:"blue",verboseLvl:1,newLine:true});
}

function log({message, color=null, verboseLvl=1,newLine=false}={}) {
  if (verboseLvl) {
    message = color ? clor[color](message).toString() : message;
    message += newLine ? "\n" : "" ;
    process.stdout.write(message);
    // process.stdout.write(message + newLine ? "\n" : "");
  }
}