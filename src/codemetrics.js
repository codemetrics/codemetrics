"use strict";

module.exports = class Codemetrics {
  constructor(input,verbose = false) {
    this.input = input;
    this.data = {};
    this.isVerbose = verbose;
    return this;
  }

  parse(parsers){
    this._log("--------------------");
    this._log("Parse...");
    try {
      this.data = parsers[0].run(this.input);
    } catch(e){
      console.error(parsers[0],e);
    }
    // trig error
    return this;
  }

  process(processors) {
    this._log("--------------------");
    this._log("Process...");

    this.data = processors.reduce((acc,processor) => {
      this._log("->",processor.key)
        acc[processor.key] = processor.run(this.data);
        return acc;
    },{});


    return this;
  }

  report(reporters) {
    this._log("--------------------");
    this._log("Report...");

    reporters.forEach(reporter=>reporter.run(this.data));

    return this;
  }

  _log(message) {
    if(this.isVerbose){
      console.log(message);
    }
  }
}