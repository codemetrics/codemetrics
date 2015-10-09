"use strict";
//const npm = require("npm");

var exec = require("child_process").exec;

const inquirer = require("inquirer");
const clor = require("clor");



module.exports = handlePlugin;

//TODO help message if plugin not found
// -> Auto install
// TODO provide silent option
//
//TODO Test si url
function handlePlugin(plugin, type){
    if(plugin.worker && typeof(plugin.worker) === "function") {
        let worker = plugin.worker(plugin.options);

        if(worker.run && typeof(worker.run) === "function") {
            return Promise.resolve(worker);
        } else {
            return searchForAPackage(plugin,type);
        }

    } else {
        return searchForAPackage(plugin,type);
    }
}

function searchForAPackage(plugin, type){
    var promisePlugin;

    var pkgName = "codemetrics-"+type+"-"+plugin.name ;

    try {
        let worker = require(pkgName)(plugin.options);

        worker.name = worker.name || plugin.name;

        promisePlugin = Promise.resolve(worker);

    } catch(e){
    // TODO Check if error is only for the package that codemetrics wants to require
        if ( e.code === "MODULE_NOT_FOUND" ) {
          let msg = clor.yellow(`The ${plugin.name} ${type} ( ${pkgName} ) cannot be found.`)
      .line("You have to install it before running CodeMetrics.")
      .line
      .line.bold.yellow("May I try to do it for you ?")
      .line();

          log(msg.toString()) ;

          promisePlugin = askForAutoInstall(pkgName)
             .then(() => {
                 log(pkgName+ " install in progress...","green");
                 return installPackage(pkgName);
             })
             .then(() => handlePlugin(plugin,type));
      //.then((plugin) => resolve(plugin))
      //.catch((message) => reject(message)

      } else {
          promisePlugin = Promise.reject({
              msg : "Plugin initialisation error",
              errorMsg : e
          });
      }
    }

    return promisePlugin;
}


function askForAutoInstall(pkgName){

  //clor.red.bold("fee").line.inverse("fi").line.underline("fo")

    return new Promise(function(resolve,reject) {
        inquirer.prompt([{
            type: "confirm",
            name: "autoinstall",
            message: "Do you want to install "+ pkgName +" ?",
            default:true,
        }], function(response) {
          if(response.autoinstall) {
            resolve();
        } else {
            reject({
              msg : "Sorry I can't continue. You should provide an existing plugin..."
          });
        }
      });

    });
}

/* Require npm dependeny
function installPackage(pkgName) {
npm.load(null,function(err, _npm) {
  if(err){
    console.log(err);
  }

  _npm.commands.install([pkgName],function(){
    hello = require(pkgName);
    cb();
  });
});
}
*/

function installPackage(pkgName) {
    return new Promise(function(resolve,reject){
        log2("Trying to install from npm :  npm install "+pkgName);
        exec("npm install "+pkgName,function(error, stdout, stderr) {

          //TODO handle code error from npm
            if (error) {
              reject({
                msg : error
            });
          } else {
              log2(stdout);
              resolve(stdout);
          }
        });
    });
}

//TODO extract to an helper
function log(message,color){
    message = color ? clor[color](message).toString() : message;
    console.log(message);
}
function log2(...params) {
  //if(verbose.LVL>2) {
    log(params);
  //}
}