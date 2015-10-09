const Logger = require("./logger.js");

const path = require("path");
const cli = require("commander");


const Codemetrics = require("./codemetrics.js");
const handlePluginHelper = require("./handlePluginHelper.js");




const defaultConfigFile = "./codemetrics.config.js";



//TODO provide cli input only when used with nodejs

cli
  .version("0.0.1")
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
  .then((plugins) => handlePlugins(config.reporters,"reporter",plugins))
  .then((plugins) => {
      new Codemetrics(input,verbose)
    .parse(plugins.parser)
    .process(plugins.processor)
    .report(plugins.reporter) ;
  });

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


function loadDefaultConfig(){
    if(process.env.NODE_ENV === "dev") {
        Logger.info("Dev plugins only");
    }
    return process.env.NODE_ENV === "dev" ?
        {
            parsers : [{
                name:"raw parser",
                worker : require("../tests/devPlugins/parser.js")
            }],
            processors : [{
                name:"dumb processor",
                worker : function() {
                  return {
                  run : function(data) {
                    return data;
                }
              };
              }
            }],
            reporters : [{
                name:"console",
                worker : function() {
                  return {
                  run : function(data) {
                    console.log(data);
                }
              };
              }
            }]
        } :
        {
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
}




function processConfig(configFile = defaultConfigFile){
    //TODO valid configuration
    return configFile ? loadConfigFile(configFile) : loadDefaultConfig() ;
}


function loadConfigFile(configFile){
    var config  ;
    try {
        config = require(path.resolve(configFile));
    } catch(e) {

        Logger.warning("Can't load the config file ( " + configFile+" )",e) ;
        Logger.warning("Loading default config") ;
        config = loadDefaultConfig();
    //process.exit(1);
    }
    return config;
}

