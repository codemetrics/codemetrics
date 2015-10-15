import test from "tape";
//import cli from "../../src/cli";
import {exec} from "child_process";

const baseCommand = "babel-node src/cli";
test("should provide help if bad input",function(t){

  exec(baseCommand,function(err, stdout){
    if (err) {
      throw err;
    }
    t.equal(stdout.includes("Usage"),true,"display usage helper");

    t.end();
  });


});
