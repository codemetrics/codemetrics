//Config file for dev purpose
module.exports = {
  parsers: [{
    name: "file"
  }],
  processors: [{
    name: "dumb processor",
    run: function(data) {
      return data;
    }
  }],
  reporters: [{
    name: "console",
    run: function(data) {
      console.log(JSON.stringify(data, null, " "));
    }
  }]
};
