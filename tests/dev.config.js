//Config file for dev purpose
module.exports = {
    parsers: [{
        name: "raw parser",
        run: function() {
          return [{
            name: "the file",
            path: ".../.../",
            data: ["111", "222", "333"]
          }];
        }
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
