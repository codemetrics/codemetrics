/* global process */
"use strict";

const path = require("path");
const cli = require("commander");
const clor = require("clor");

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
//console.log(config,cli.args);


var parsers,processors,reporters;


//TODO provide ability to handle multiples parsers
//TODO parsers could be piped
handlePlugins(config.parsers,"parser",{})
  //.then((result) => {parsers = result})
  .then((plugins) => handlePlugin(config.processors,"processor",plugins))
  //.then((result) => {processors = result})
  .then((plugins) => handlePlugin(config.reporters,"reporter",plugins))
  //.then((result) => {reporters = result})
  .then((plugins) => console.log("=>",plugins))
  //TODO check input
  /*new Codemetrics(input,verbose)
  .parse(parsers)
  .process(processors)
  .report(reporters) ;

/*
const processors = config.processors.map(processor => handlePlugin(processor,"process"));
const reporters= config.reporters.map(reporter => handlePlugin(reporter,"reporter"));

*/
function handlePlugins(configListePlugins,type, plugins){
  return Promise.all(configListePlugins.map(plugin=>handlePluginHelper(plugin,type)))
  .then((result) => {
    console.log(result);
    plugins[type] = result;
    return plugins;
  })
  .catch( (result = {msg,errorMsg} ) => {
    log(result.msg,"red");
    if(result.errorMsg){
      log(clor.line.bold.red("Error : ").line(result.errorMsg).toString());
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
    log("Using configuration file","blue") ;
  } catch(e) {
    log("No configuration provided","red",true) ;

    process.exit(1);
  }
  return config;
}




function log(message,color,bypassVerbose){
  if(verbose || bypassVerbose){
    message = color ? clor[color](message).toString() : message;
    console.log(message);
  }
}