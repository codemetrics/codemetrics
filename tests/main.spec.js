import test from "tape";
import Codemetrics from "codemetrics-core";

test("should have a valid core instance",function(t){


  t.doesNotThrow(function(){
    new Codemetrics(null,console);
  });

  t.end();

});