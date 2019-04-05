# Output Manager
Output manager that allows for level-based output.  By default, this outputs to the console, but it by no means is required to.  See below for examples on how to output to a file, or to a stream.  The format of the output is also completely in your control, as it can be adapted and modified as needed.

## The Fun Stuff
[![Build Status](https://secure.travis-ci.org/MaddHacker/output-manager.svg?branch=master)](http://travis-ci.org/MaddHacker/output-manager)

[![Code Climate](https://codeclimate.com/github/MaddHacker/output-manager/badges/gpa.svg)](https://codeclimate.com/github/MaddHacker/output-manager)

[![Issue Count](https://codeclimate.com/github/MaddHacker/output-manager/badges/issue_count.svg)](https://codeclimate.com/github/MaddHacker/output-manager)

[![Test Coverage](https://codeclimate.com/github/MaddHacker/output-manager/badges/coverage.svg)](https://codeclimate.com/github/MaddHacker/output-manager/coverage)

[![Dependency Status](https://david-dm.org/MaddHacker/output-manager/status.svg)](https://david-dm.org/MaddHacker/output-manager)

[![npm Version](https://badge.fury.io/js/output-manager.svg)](https://badge.fury.io/js/output-manager)

## Why *Another* Output/Logging tool?
Several npms utilize multiple dependencies, and lead to code bloat.  There are also several modules on the market that are very opinionated (e.g. force you to do certain things) or are focused on a single form of logging/output.  This tool aims to be a lightweight, flexible solution that allows for output to one or many sources as the user needs.

## Getting Started
- Install [the npm](https://www.npmjs.com/package/output-manager) in your project: `npm install --save output-manager`
- Require the library where needed: `const om = require('output-manager');`
- Create a new Output object and override as needed `const O = om.Out();`
- Output using one of several levels.  Each has a short and a long name.

# The LogLevels
As with most logging systems, there have been several levels defined to allow for grainular output.  In order from most verbose to least verbose, those are:
- `TRACE` => only used for those really hard problems and lots of information
- `DEBUG` => used to provide more development focused output
- `INFO` => used to provide information to the consumer of the output
- `WARN` => things might be going wrong...
- `ERROR` => things have gone wrong, but we're trying to stay up
- `FATAL` => it's all sideways, and this is the last bit of information before the process exits

Each of these levels are defined in the `require('output-manager').LogLevels` enum.

Access to log levels is through a relevantly named function, of which there is a short and long name for.  These are:
- `TRACE` => uses `O.t(msg)` or `O.trace(msg)`
- `DEBUG` => uses `O.d(msg)` or `O.debug(msg)`
- `INFO` => uses `O.i(msg)` or `O.info(msg)`
- `WARN` => uses `O.w(msg)` or `O.warn(msg)`
- `ERROR` => uses `O.e(msg)` or `O.error(msg)`
- `FATAL` => uses `O.f(msg)` or `O.fatal(msg)`

## Setting the LogLevel
The LogLevel is dynamically set/adjusted as the application is running.  This allows any developer to write a hook to turn up logs in a running environment without restart or issue.  By default, the LogLevel is set to `INFO` but can easily be changed using the `O.level = newLevel` method.  An example of this is:
```
const om = require('output-manager');
const o = new om.Out();
O.d('Hi, I am debug'); // no output
O.level = om.LogLevel.DEBUG;
O.d('Hi, I am debug'); // outputs: Hi, I am debug
```

## Checking the LogLevel
The current LogLevel will be returned anytime `O.level` is called.

# Message Formatting
The message format is currently set to `<ISODate> [<LEVEL>] <message>`.  The ISODate is the ISO formatted date that can be externally accessed via the `#date()` method.  This format uses the [standard set by ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) which effectively looks like:
```
yyyy-MM-ddTHH:mm:ss.SSSZ
2017-01-21T06:35:44.302Z
```
Note that the `T` always occurs between the date and the time.  The `Z` indicates UTC.

The `[<LEVEL>]` indicates the LogLevel the message was sent at.  This will always be 5 characters long, with whitespace added to the 4 character LogLevel names after the name, before the ending `]`. (See [string-utilz](https://github.com/MaddHacker/string-utilz#string-helpers)`#fixSize(size,char)`)  This ensures consistent formatting when looking at logs in the console, or a file.

To put all of this together, here are some example outputs:
```
const om = require('output-manager');
const O = new om.Out();
O.level= om.LogLevel.TRACE;
O.t('Hi, I am trace'); // 2017-01-21T06:35:44.302Z [TRACE] Hi, I am trace
O.d('Hi, I am debug'); // 2017-01-21T06:35:44.402Z [DEBUG] Hi, I am debug
O.i('Hi, I am info');  // 2017-01-21T06:35:44.612Z [INFO ] Hi, I am info
O.w('Hi, I am warn');  // 2017-01-21T06:35:45.302Z [WARN ] Hi, I am warn
O.e('Hi, I am error'); // 2017-01-21T06:35:45.702Z [ERROR] Hi, I am error
O.f('Hi, I am fatal'); // 2017-01-21T06:35:46.311Z [FATAL] Hi, I am fatal
```

## Customizing Message Formatting
Message format can be customized by setting the `O.fmt` property to a function.  This function is passed two parameters (in order): `message {string}` and `lvl {LogLevel}`.  This can be formatted in any way desired, and then the result should be returned.  An example that just outputs the message is:
```
const om = require('output-manager');
const O = new om.Out();
O.fmt = (msg, level) => { return msg; }; // just output the message
```

# Controlling Output
Currently, the application defaults to using `process.stdout.write(msg + os.EOL)` for all output.  However, this may not be efficient, and is almost impossible to test.  The output is controlled through an `output` property, which can be set using the `O.output = (logMsg)=>{}`.  This output is called after 2 things have happened:
- The message has been determined to be at a level that needs to be output (`O.levelFilter`)
- The message has been formatted as described in Message Formatting (`O.fmt`)
To override the default `output` you can do something like:
```
const om = require('output-manager');
const O = new om.Out();
O.output = (logMsg) => { console.log(logMsg); /* add file and/or add stream */ };
```
This control means that the output can be sent to the console, as well as to a websocket, or a file.

*NOTE: It is the goal to start to build some of this functionality into the module*

# All Output
Before the `LogLevel` is checked, the message and its given `level` go through the `onLog` function (a property as well).  This can be overridden by calling the `O.onLog = ()=>{}` and setting the function that should be used.  This can be overridden to absorb all output and stream it wherever is needed (as desired).  It is important to note that if you override this function you *MUST* call the `O.levelFilter` function.  An example override might look something like this:
```
const om = require('output-manager');
const O = new om.Out();
O.onLog = (msg, level) => { 
    /* do something fun */ 
    O.levelFilter(msg, level); 
    };
```

# Dependencies and Why
- [string-utilz](https://www.npmjs.com/package/string-utilz)

This is used to manage strings and string formatting.  This is a super-lightweight framework that helps to minimize disruptions in your code.  Primarily used for formatting.

- [date-utilz](https://www.npmjs.com/package/date-utilz)

This is used to manage dates and date formatting.  This is a super-lightweight framework that helps to minimize disruptions in your code.  Primarily used for formatting.

# Slack
This is one of several projects that are in the works, so feel free to reach out on [Slack](https://maddhacker.slack.com/).  Please email `slack at maddhacker dot com` for an invite.

# Issues
Please use the [Issues tab](../../issues) to report any problems or feature requests.

# Change Log
All change history can be found in the [CHANGELOG.md](CHANGELOG.md) file.

# Example Repositories
- [example-output-to-file](https://github.com/MaddHacker/example-output-to-file)

Using `output-manager` to write to a file

- [example-output-to-stream](https://github.com/MaddHacker/example-output-to-stream)

Using `output-manager` to dump logs to a stream