import Logger from "./logger";



import Codemetrics from "codemetrics-core";

import cli from "./cli";

//console.log(config,input);


const handlePluginHelper = require("./handlePluginHelper.js");

//TODO check input
//console.log(config,cli.args);

//var parsers,processors,reporters;


const {
  config, input
} = cli();


//TODO provide ability to handle multiples parsers
//TODO parsers could be piped
handlePlugins(config.parsers, "parser", {})
  //.then((result) => {parsers = result})
  //TODO Fix the name processor > process
  .then((plugins) => handlePlugins(config.processors, "process", plugins))
  .then((plugins) => handlePlugins(config.reporters, "reporter", plugins))
  .then((plugins) => {
    new Codemetrics(input, Logger)
      .parse(plugins.parser)
      .process(plugins.processor)
      .report(plugins.reporter);
  });



function handlePlugins(configListePlugins, type, plugins) {
  Logger.load(type, Logger.LOG_LVLS.LOADING);
  return Promise.all(configListePlugins.map((plugin) => handlePluginHelper(plugin, type)))
    .then((result) => {
      Logger.load(type, Logger.LOG_LVLS.SUCCESS);


      //todo rename process > processor
      if (type === "process") {
        type = "processor";
      }
      plugins[type] = result;
      return plugins;
    })
    .catch((result) => {

      Logger.error(result.msg);
      if (result.errorMsg) {
        Logger.bigError(result.errorMsg);
      }
      process.exit(1);
    });
}
