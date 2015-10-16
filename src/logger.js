const logSymbols = require("log-symbols");
const clor = require("clor");

const PLUGINS_TYPES_NAMES = {
  parser: "parsers",
  reporter: "reporters",
  process: "processors"
};
const LOG_LVLS = {
  LOADING: 0,
  SUCCESS: 1
};

const VERBOSE_LVLS = {
  NO_OUTPUT: 0,
  MINIMAL: 1,
  INFORMATIVE: 2,
  TALKATIVE: 3,
  DEBUG: 4
};

const logLoad = {
  [LOG_LVLS.LOADING]: (type) => log({
    message: "Loading " + PLUGINS_TYPES_NAMES[type] + "... ",
    verboseLvl: VERBOSE_LVLS.INFORMATIVE,
    newLine: false
  }), [LOG_LVLS.SUCCESS]: () => log({
    message: logSymbols.success,
    verboseLvl: VERBOSE_LVLS.INFORMATIVE
  })
};


var currentVerboseLevel = VERBOSE_LVLS.INFORMATIVE;


module.exports = {
  setVerboseLevel: function(level) {
    if (level > 4) {
      level = 4;
    }
    currentVerboseLevel = level;
  },
  log,
  error: function(message) {
    log({
      message, color: "red", verboseLvl: VERBOSE_LVLS.MINIMAL
    });
  },
  warning: function(message) {
    log({
      message, color: "yellow", verboseLvl: VERBOSE_LVLS.MINIMAL
    });
  },
  info: function(message) {
    log({
      message, color: "blue", verboseLvl: VERBOSE_LVLS.INFORMATIVE
    });
  },
  notice :function(message) {
    log({
      message, color: "green", verboseLvl: VERBOSE_LVLS.INFORMATIVE
    });
  },
  infoPlus: function(message) {
    log({
      message, color: "blue", verboseLvl: VERBOSE_LVLS.TALKATIVE
    });
  },
  debug: function(message) {
    log({
      message, verboseLvl: VERBOSE_LVLS.DEBUG
    });
  },



  separator: () => log({
    message: "---------------------",
    color: "white",
    verboseLvl: VERBOSE_LVLS.TALKATIVE
  }),
  load: (type, status) => logLoad[status](type),
  bigError, // helper may change ( FATAL lvl)? )
  LOG_LVLS,
  VERBOSE_LVLS
};


function log({
  message, color = null, verboseLvl = currentVerboseLevel, newLine = true
} = {}) {
  if (verboseLvl <= currentVerboseLevel) {
    message = color ? clor[color](message).toString() : message;
    message += newLine ? "\n" : "";
    process.stdout.write(message);
    // process.stdout.write(message + newLine ? "\n" : "");
  }
}


function bigError(message) {
  console.log(clor.line.bold.red("Error : ").line(message).toString());
}
