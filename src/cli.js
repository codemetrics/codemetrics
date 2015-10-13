import cli from "commander";

const VERBOSE_LVLS = {
    NO_OUTPUT   : 0,
    MINIMAL     : 1,
    INFORMATIVE : 2,
    TALKATIVE   : 3,
    DEBUG       :4
};

const defaultConfigFile = "./codemetrics.config.js";

const dataCLI = cli
  .version("0.0.1")
  .option("-C, --config <file>", "config file")
  .option("-s, --silent", "no output")
  .option("-v, --verboseLvl", "tell me what you do",VERBOSE_LVLS.INFORMATIVE)
  .parse(process.argv);


export const config = processConfig(dataCLI.config);

console.log(dataCLI.verbose);
export const verboseLvL = dataCLI.verbose ;

export const input = dataCLI.args[0] ;
/*
if(!program.args.length) {
    program.help();
} else {
    console.log('Keywords: ' + program.args);
}*/

function loadDefaultConfig() {
    if (process.env.NODE_ENV === "dev") {
        Logger.info("Dev plugins only");
        return;
    }
    return {
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

