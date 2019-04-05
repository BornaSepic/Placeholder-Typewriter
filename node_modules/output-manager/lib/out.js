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

class Level {
    constructor(_value, _fxn, _name) {
        this.value = _value;
        this.fxn = _fxn;
        this.name = _name;
    }
}

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
    TRACE: new Level(0, 't', 'TRACE'),
    DEBUG: new Level(10, 'd', 'DEBUG'),
    INFO: new Level(20, 'i', 'INFO'),
    WARN: new Level(30, 'w', 'WARN'),
    ERROR: new Level(40, 'e', 'ERROR'),
    FATAL: new Level(50, 'f', 'FATAL')
};

class Out {
    constructor(lvl) {
        /* Defaults to INFO level */
        this.__logLevel = lvl || LogLevel.INFO;

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
        this.output = (msg) => process.stdout.write(msg + os.EOL);

        /**
         * Used to format message structure
         * 
         * @param {string} message
         * @param {LogLevel} lvl
         * 
         * @returns {string} formatted as required
         */
        this.fmt = (msg, lvl) => { return stringz.fmt('%{0} [%{1}] %{2}', datez.date(), stringz.fixSize(lvl.name, 5), msg); }

        /**
         * Entry point that can be hijacked, in case all logs need to be streamed
         * 
         * All log level calls filter here.
         * 
         * @param msg => message to output
         * @param lvl => level the message should be logged at
         * 
         * @see #logIfLevelAllows(msg,lvl)
         */
        this.onLog = (msg, lvl) => { this.levelFilter(msg, lvl); }

        /**
         * Main logger, takes a message and a target level, then determines if the 
         * message should be logged.
         * 
         * Also allows others to use this functionality.
         * 
         * @return {function} that takes 2 parameters [(msg, lvl)] and logs out the
         *      message if allowed by the set level.
         * 
         * @param msg => message to output
         * @param lvl => level the message should be logged at
         * 
         * @usage logByLevel(msg,lvl)
         */
        this.levelFilter = (msg, lvl) => { if (this.level.value <= lvl.value) { this.output(this.fmt(msg, lvl)); } }

        /**
         * Output managers, can use either method name
         * 
         * @param msg => message to output
         * 
         * @see onLog(msg,lvl)
         */
        /* TRACE */
        this.t = (msg) => { this.onLog(msg, LogLevel.TRACE); }
        this.trace = (msg) => { this.t(msg); }

        /* DEBUG */
        this.d = (msg) => { this.onLog(msg, LogLevel.DEBUG); }
        this.debug = (msg) => { this.d(msg); }

        /* INFO */
        this.i = (msg) => { this.onLog(msg, LogLevel.INFO); }
        this.info = (msg) => { this.i(msg); }

        /* WARN */
        this.w = (msg) => { this.onLog(msg, LogLevel.WARN); }
        this.warn = (msg) => { this.w(msg); }

        /* ERROR */
        this.e = (msg) => { this.onLog(msg, LogLevel.ERROR); }
        this.error = (msg) => { this.e(msg); }

        /* FATAL */
        this.f = (msg) => { this.onLog(msg, LogLevel.FATAL); }
        this.fatal = (msg) => { this.f(msg); }
    }

    get level() { return this.__logLevel; }
    set level(lvl) { this.__logLevel = lvl; }
}

module.exports = {
    LogLevel: LogLevel,
    Out: Out,
};
