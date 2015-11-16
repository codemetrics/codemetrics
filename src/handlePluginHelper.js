import {exec} from "child_process";
import inquirer from "inquirer";
import Logger from "./logger";

const messageBeforeAskingAutoInstall = `
  The provided configuration specified a plugin which can't be found .
  It's certainly because you didn't install it with npm before running Codemetrics.

  I can try to do it for you.
`;

module.exports = handlePlugin;

/**
 * This handler can check and install missing
 * plugins in order to provide a valide component
 * in the main runner
  // TODO provide silent option
  //TODO Test if url, give the ability to install a plugin out of npm ?
 */
// -> Auto install
//
function handlePlugin(plugin, type) {

  return isPluginValide(plugin) ?
    Promise.resolve(plugin) :
    searchForAPackage(plugin, type)
    .then(handlePlugin);
}


function searchForAPackage(plugin, type) {
  var promisePlugin;
  const pkgName = "codemetrics-" + type + "-" + plugin.name;
  Logger.debug("Search for "+pkgName);

  try {
    const pluginInstance = require(pkgName)();
    pluginInstance.name = pluginInstance.name || plugin.name;
    promisePlugin = Promise.resolve(pluginInstance);

  } catch (e) {
    // TODO Check if error is only for the package that codemetrics wants to require
    if (e.code === "MODULE_NOT_FOUND") {
      Logger.warning(`The ${plugin.name} ${type} ( ${pkgName} ) cannot be found.`);
      Logger.warning(messageBeforeAskingAutoInstall);

      promisePlugin = askForAutoInstall(pkgName)
        .then(() => installPackage(pkgName))
        .then(() => handlePlugin(plugin, type));
      //.then((plugin) => resolve(plugin))
      //.catch((message) => reject(message)

    } else {
      promisePlugin = Promise.reject({
        msg: "Plugin initialisation error",
        errorMsg: e
      });
    }
  }

  return promisePlugin;
}


function askForAutoInstall(pkgName) {

  return new Promise(function(resolve, reject) {
    inquirer.prompt([{
      type: "confirm",
      name: "autoinstall",
      message: "Do you want to install " + pkgName + " from npm ?",
      default: true
    }], function(response) {
      if (response.autoinstall) {
        resolve();
      } else {
        reject({
          msg: "Sorry I can't continue. You should provide a valid plugin..."
        });
      }
    });

  });
}

/**
 * The plugin must have a worker function
 * the worker must be a runnable function
 * @param  {[type]}  plugin [description]
 * @return {Boolean}        [description]
 */
function isPluginValide(plugin){
  //todo warn if name not present ?
  if(plugin.run) {
    if(typeof(plugin.run) === "function") {
      Logger.debug("\n Plugin "+plugin.name+" have a runnable function");
      return true;
    } else {
      Logger.debug("\n Plugin "+plugin.name+" : runnable property is not a function");
      //TODO raison
      return false;
    }
  } else {
    //TODO raison
    Logger.debug("\n Plugin "+plugin.name+" : runnable function not found");

    return false;
  }
}


function installPackage(pkgName) {
  Logger.info("Trying to install from npm :  npm install " + pkgName);

  return new Promise(function(resolve, reject) {
    exec("npm install " + pkgName, function(error, stdout) {

      //TODO handle code error from npm
      if (error) {
        reject({
          msg: error
        });
      } else {
        Logger.debug(stdout);
        Logger.notice(pkgName + " install in progress...");
        resolve(stdout);
      }
    });
  });
}