"use strict";

var test = require("tape");
var intercept = require("intercept-stdout");

var Logger = require("../../src/logger.js");
var Logger2 = require("../../src/logger.js");

//test("should skip low level log by default",function(t){
//  Logger.debug("test");
//
//  t.end();
//});



test("should keep the verbose config",function(t){
  Logger.setVerboseLevel(0);
  var captured_text = "";

  var unhook_intercept = intercept(function(txt) {
      captured_text += txt;
  });

  Logger.info("test Logger 1")
  Logger2.info("test Logger 2");

  Logger.setVerboseLevel(4);

  Logger2.info("test");



  t.equal(captured_text,"\x1b[34mtest\x1b[0m\x1b[0m\n");


  unhook_intercept();

  t.end();

});