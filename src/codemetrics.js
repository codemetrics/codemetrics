export default class Codemetrics {
  constructor(input, Logger) {
    //TODO logger validator
    if (typeof Logger === "undefined") {
      throw new Error("You must specify a logger");
    }

    this.input = input;
    this.data = {};
    this.logger = Logger;
    return this;
  }

  parse(parsers) {
    this.logger.separator();
    this.logger.info("Parse...");
    try {
      this.data = parsers[0].run(this.input, {
        log: this.logger
      });
    } catch (e) {
      var msg = "Error from " + parsers[0].name + " parser \n ----> " + e.toString();
      this.logger.error(msg);
      process.exit(1);
    }
    // trig error
    return this;
  }

  process(processors) {
    this.logger.separator();
    this.logger.info("Process...");

    this.data = processors.reduce((acc, processor) => {
      this.logger.info("-> " + processor.name);
      acc[processor.name] = processor.run(this.data);
      return acc;
    }, {});


    return this;
  }

  report(reporters) {
    this.logger.separator();
    this.logger.info("Report...");

    reporters.forEach(reporter => reporter.run(this.data));

    return this;
  }
}
