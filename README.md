# CodeMetrics
A highly pluggable system to get stats from your projects

:warning: This is NOT for production at this moment

## Current status
POC

## Goal
Provide a tool to get metrics, statistics and what you want from a static analyse of source code with all the technical stuff provided by plugins.

## Anatomy of the plugin system


Codemetrics is based on a file analysis model. That means the input and work unit is the file, but thanks the plugin system you can provide data in an other way, you just have to respect input format.



                              +----------------------------------------------------------------------+
                              |                                                                      |
                              |    RUNNER                                                            |
                              |                                                                      |
                              |                                                                      |
                              |                                                                      |
       Input :                |                                                                      |
        Glob pattern          |   +-------------+         +-------------+         +-------------+    |
        Raw data              |   |             |         |             |         |             |    |
           +------------------>   |             |         |             |         |             |    +------------------>
                              |   |  Parser(s)  +---------> Processor(s)+---------> Reporter(s) |    |
                              |   |             |         |             |         |             |    |    Output :
                              |   |             |         |             |         |             |    |    Simple JSON
                              |   +-------------+         +-------------+         +-------------+    |    Nice console output
                              |                                                                      |    HTML
                              |                                                                      |    ...
                              |                                                                      |
                              |                                                                      |
                              |                                                                      |
                              +----------------------------------------------------------------------+


Data is passed from parsers to reporters in order and chained. You can provide multiple plugins in each category and  combine them. Only parsers will transform data .



_Rules to follow_

* Every plugin MUST have a run function which accept a data object.
* A plugin have a unique key provided by the name of the plugin ( as written in package.json)

### Plugin options
Plugins options can be passed through config file and/or CLI. For each plugin, an option object will override default. Each plugin could expose an API exepct for input and output dataCLI control

### Parser plugins

It is the input point for all the data. Generally you want to analyse the files of your project but, in case you want to provide another way , this is the place to do it.

You can combine multiple parsers plugin to parse the input. Input data will be mutated throught each parser in order specified by the config.

The primary argument of the CLI is automatically provided to the parser as input.

_Rules_

Output format *MUST be at the very minimum*:

[{
  data : (String) data parsed
}]

It's *better* to provide

[{
  name : (String) name of the "file",
  path : (String) path to the file, could be empty,
  data : (String) data parsed
}]

### Processor plugins

This is where magic append. All the analysis must be in the processors plugins. You can count the number of lines of your files , measure complexity or even parse the dependency tree.

### Reporter plugins

All this data need to be nicely exposed. This is the job of reporters. You are totally free of the output format, the only things to use correctly is the data source.

With plugins, you introduce custom keys that reporters can use. This is a great opportunity to tune your reporter in order to work better with some specific plugins.

TODO > example  dependcies.

Because each plugin is associated with a unique key, it is easy to adapt your reporting to just one plugin or multiples plugins.

##Logging

###Error report
