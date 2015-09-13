"use strict";

const Logger = require("./logger.js");

module.exports = class Codemetrics {
  constructor(input,verbose = false) {
    this.input = input;
    this.data = {};
    this.isVerbose = verbose;
    return this;
  }

  parse(parsers){
    Logger.separator();
    Logger.info("Parse...");
    try {
      this.data = parsers[0].run(this.input,{log:Logger});
    } catch(e){
      var msg = "Error from "+parsers[0].name+" parser \n ----> "+e.toString();
      Logger.error(msg);
      process.exit(1);
    }
    // trig error
    return this;
  }

  process(processors) {
    Logger.separator();
    Logger.info("Process...");

    this.data = processors.reduce((acc,processor) => {
      Logger.info("->",processor.key)
        acc[processor.key] = processor.run(this.data);
        return acc;
    },{});


    return this;
  }

  report(reporters) {
    Logger.separator();
    Logger.info("Report...");

    reporters.forEach(reporter=>reporter.run(this.data));

    return this;
  }
}