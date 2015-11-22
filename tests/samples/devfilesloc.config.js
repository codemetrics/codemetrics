//Config file for dev purpose
module.exports = {
  parsers: [{
    name: "file"
  }],
  processors: [{
    name: "sloc"
  }],
  reporters: [{
    name: "console",
    run: function(data) {
      console.log(JSON.stringify(data, null, " "));
    }
  }]
};
