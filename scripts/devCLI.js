import inquirer from "inquirer";
import {exec} from "child_process";


const CLIChoices = [
  {
    name : "2 Process plugin ",
    value : "--config ./tests/samples/config/devfilesloctodo.config.js ./tests/samples/*.* -v 4"
  },
  {
    name : "Verbose with plugin processing and parser",
    value : "--config ./tests/samples/config/devfilesloc.config.js ./tests/samples/*.* -v 4"
  },
  {
    name : "Verbose with embedded processing and plugin parser",
    value : "--config ./tests/samples/config/devfile.config.js ./tests/samples/*.* -v 4"
  },
  {
    name : "Verbose, simple with embedded processing",
    value : "--config ./tests/samples/config/dev.config.js ./tests/samples/ -v 4"
  }
];

inquirer.prompt([{
  type: "list",
  name: "CLI",
  message: "Which environnement do you want to load ?",
  choices: CLIChoices
}], function(selection) {

  console.log("\n","npm start -- "+selection.CLI,"\n");

  const codemetricsProcess = exec("npm start -- "+selection.CLI);
  codemetricsProcess.stdout.pipe(process.stdout);
  codemetricsProcess.stderr.pipe(process.stderr);


});
