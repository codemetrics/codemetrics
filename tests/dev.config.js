//Config file for dev purpose
{
    parsers: [{
        name: "raw parser",
        worker: function() {
            return {
                run: function() {
                    return [{
                        name: "the file",
                        path: ".../.../",
                        data: ["111", "222", "333"]
                    }];
                }
            }
        }
    }],
    processors: [{
        name: "dumb processor",
        worker: function() {
            return {
                run: function(data) {
                    return data;
                }
            };
        }
    }],
    reporters: [{
        name: "console",
        worker: function() {
            return {
                run: function(data) {
                    console.log(data);
                }
            };
        }
    }]
}
