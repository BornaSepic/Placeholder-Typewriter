/**
 * Copyright 2017 MaddHacker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * Library to easily manage output for all JS.
 * 
 * This is meant to be terse and lightweight in order to minimize impact to applications.
 */

const stringz = require('string-utilz');
const datez = require('date-utilz');
const os = require('os');

/**
 * Simple enum to manage log levels.
 * 
 * From most (to least) verbose:
 * 
 * TRACE
 * DEBUG
 * INFO
 * WARN
 * ERROR
 * FATAL
 *  
 */
const LogLevel = {
    TRACE: {
        value: 0,
        fxn: 't',
        name: 'TRACE'
    },
    DEBUG: {
        value: 10,
        fxn: 'd',
        name: 'DEBUG'
    },
    INFO: {
        value: 20,
        fxn: 'i',
        name: 'INFO'
    },
    WARN: {
        value: 30,
        fxn: 'w',
        name: 'WARN'
    },
    ERROR: {
        value: 40,
        fxn: 'e',
        name: 'ERROR'
    },
    FATAL: {
        value: 50,
        fxn: 'f',
        name: 'FATAL'
    }
};

/* Defaults to INFO level */
var __logLevel = LogLevel.INFO;

/**
 * TRACE output - can use t() or trace()
 * 
 * @param msg => message to output
 * @see __doLog()
 */
const t = msg => __doLog(msg, LogLevel.TRACE);

/**
 * DEBUG output - can use d() or debug()
 * 
 * @param msg => message to output
 * @see __doLog()
 */
const d = msg => __doLog(msg, LogLevel.DEBUG);

/**
 * INFO output - can use i() or info()
 * 
 * @param msg => message to output
 * @see __doLog()
 */
const i = msg => __doLog(msg, LogLevel.INFO);

/**
 * WARN output - can use w() or warn()
 * 
 * @param msg => message to output
 * @see __doLog()
 */
const w = msg => __doLog(msg, LogLevel.WARN);

/**
 * ERROR output - can use e() or error()
 * 
 * @param msg => message to output
 * @see __doLog()
 */
const e = msg => __doLog(msg, LogLevel.ERROR);

/**
 * FATAL output - can use f() or fatal()
 * 
 * @param msg => message to output
 * @see __doLog()
 */
const f = msg => __doLog(msg, LogLevel.FATAL);

/**
 * Set the LogLevel, can be used to change the level on the fly.
 * 
 * @param newLevel => new LogLevel to use
 * @see LogLevel
 */
const setLevel = newLevel => __logLevel = newLevel;

/**
 * Returns the current LogLevel
 * 
 * @see LogLevel
 */
const atLevel = () => { return __logLevel; }

/**
 * Entry point that can be hijacked, in case all logs need to be streamed
 * 
 * @param msg => message to output
 * @param level => level the message should be logged at
 * 
 * @see #logIfLevelAllows(msg,level)
 */
var __doLog = (msg, level) => getLogOutIfLevelAllows()(msg, level);

/**
 * Allow for override of fxn that all messages go through.  Could be
 * used to hijack all messages and stream a variety of log levels to 
 * a number of locations.
 * 
 * This should be set to a function that takes 2 parameters
 * @param {string} log message
 * @param {LogLevel} level of the log message
 * 
 * @see #getLogOutIfLevelAllows()
 * 
 * @usage setDoLog(function (msg,level) { 
 *          //send to file or stream
 *          getLogOutIfLevelAllows()(msg,level); 
 *          });
 */
const setDoLog = fxn => __doLog = fxn;

/**
 * Main logger, takes a message and a target level, then determines if the 
 * message should be logged.
 * 
 * Also allows others to use this functionality.
 * 
 * @return {function} that takes 2 parameters [(msg, level)] and logs out the
 *      message if allowed by the set level.
 * 
 * @param msg => message to output
 * @param level => level the message should be logged at
 * 
 * @usage getLogOutIfLevelAllows()(msg,level)
 */
const getLogOutIfLevelAllows = () => {
    return function (msg, level) {
        if (__logLevel.value <= level.value) {
            __logger(__fmtString(msg, level));
        }
    };
}

/**
 * Used to format message structure
 * 
 * @param {string} message
 * @param {LogLevel} level
 * 
 * @returns {string} formatted as required
 */
var __fmtString = (msg, level) => { return stringz.fmt('%{0} [%{1}] %{2}', datez.date(), stringz.chop(level.name, 5), msg); }

/**
 * Allow for override of format of message string.
 * 
 * This should be set to a function that takes 2 parameters
 * @param {string} log message
 * @param {LogLevel} level of the log message
 * 
 * @return {string} formatted as required
 */
const setFmtString = fxn => __fmtString = fxn;

/**
 * Internal function used to output, can be overridden as needed.
 * 
 * This should be set to a function that takes a single message param.
 * It will only be called when the string has been formatted and is of an appropriate level
 * 
 * Default is `process.stdout.write(msg + os.EOL);`
 * 
 * @param {string} message
 * 
 * @see doLog()
 * @see https://nodejs.org/api/os.html
 */
var __logger = (msg) => process.stdout.write(msg + os.EOL);

/**
 * Allow for override of the logging functionality, set the logger to whatever function you want.
 * 
 * This should be set to a function that takes a single message param.
 * It will only be called when the string has been formatted and is of an appropriate level
 * 
 * @param fxn => function that takes a single string that is the output to be logged.
 * 
 * @see doLog()
 */
const setLogger = fxn => __logger = fxn;

module.exports = {
    LogLevel: LogLevel,
    level: setLevel,
    atLevel: atLevel,
    t: t,
    trace: t,
    d: d,
    debug: d,
    i: i,
    info: i,
    w: w,
    warn: w,
    e: e,
    error: e,
    f: f,
    fatal: f,
    setDoLog: setDoLog,
    getLogOutFxn: getLogOutIfLevelAllows,
    setFmtString: setFmtString,
    setLogger: setLogger,
    date: datez.date()
};
