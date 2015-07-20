"use strict";

const path = require("path");
const cli = require("commander");
const Codemetrics = require("./codemetrics.js");


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
const verbose = cli.verbose;
const input = cli.args[0] ;
//console.log(config,cli.args);


//TODO provide ability to handle multiples parsers
const parsers = handlePlugin(config.parsers[0],"parser");
const processors = config.processors.map(processor => handlePlugin(processor,"process"));
const reporters= config.reporters.map(reporter => handlePlugin(reporter,"reporter"));


//TODO check input
new Codemetrics(input,verbose)
.parse(parsers)
.process(processors)
.report(reporters) ;


//TODO help message if plugin not found
// -> Auto install
function handlePlugin(plugin, type){
  //TODO test if valide object > require
  return require("codemetrics-"+type+"-"+plugin.name)(plugin.options);
}


function processConfig(CLIconfig){
  return CLIconfig ? require(path.resolve(CLIconfig)) : loadDefaultConfig() ;
}

function loadDefaultConfig(){
  var config = defaultConfig ;
  try {
    config = require(path.resolve(defaultConfigFile));
    log("Using configuration file") ;
  } catch(e) {
    log("No configuration provided") ;
  }
  return config;
}

function log(message){
  if(verbose){
    console.log(message);
  }
}