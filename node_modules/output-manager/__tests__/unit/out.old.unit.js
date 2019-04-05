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

const O = require('../../lib/out.old');
const stringz = require('string-utilz');

// hijack the output for tests
var __lastLog;
O.setLogger(function (logMsg) { __lastLog = logMsg; });
// hijack all output, regardless of level set output
var __allLogs;
O.setDoLog(function (msg, level) {
    __allLogs = msg;
    O.getLogOutFxn()(msg, level);
});
// format the messages
O.setFmtString(function (msg, level) {
    return msg;
});

/**
 * Abstraction of an expected positive output
 */
function testPositiveOutput(logLevel, oFxn, tmpStr) {
    for (var lvl in O.LogLevel) {
        var tmpLvl = O.LogLevel[lvl];
        if (tmpLvl.value <= logLevel.value) {
            __lastLog = null, __allLogs = null;
            O.level(tmpLvl);
            var tmpMsg = stringz.fmt('%{0}%{1}', 'hello #', tmpStr);
            oFxn(tmpMsg);
            expect(__lastLog).not.toBe(null);
            expect(__allLogs).not.toBe(null);
            expect(__lastLog).toBe(tmpMsg);
            expect(__allLogs).toBe(tmpMsg);
        }
    }
}

/**
 * Abstraction of an expected negative output (no log)
 */
function testNegativeOutput(logLevel, oFxn) {
    for (var lvl in O.LogLevel) {
        var tmpLvl = O.LogLevel[lvl];
        if (tmpLvl.value > logLevel.value) {
            __lastLog = null, __allLogs = null;
            O.level(tmpLvl);
            var tmpMsg = 'hello #fail';
            oFxn(tmpMsg);
            expect(__lastLog).toBe(null);
            expect(__allLogs).not.toBe(null);
            expect(__allLogs).toBe(tmpMsg);
        }
    }
}

describe('Out (Unit)', function () {

    describe('#level() && #atLevel()', function () {
        it('should be set to INFO by default', function () {
            expect(O.atLevel()).toBe(O.LogLevel.INFO);
        });
        it('should reflect changes immediately', function () {
            for (var lvl in O.LogLevel) {
                O.level(O.LogLevel[lvl]);
                expect(O.atLevel()).toBe(O.LogLevel[lvl]);
            }
        });
    });

    /**
     * TRACE functionality
     * #t()
     * #trace()
     */
    describe('#t()', function () {
        it('should output trace when level set to trace', function () {
            testPositiveOutput(O.LogLevel.TRACE, O.t, 't');
        });
        it('should not output trace when level set to debug or higher', function () {
            testNegativeOutput(O.LogLevel.TRACE, O.t);
        });
    });

    describe('#trace()', function () {
        it('should output trace when level set to trace', function () {
            testPositiveOutput(O.LogLevel.TRACE, O.trace, 'trace');
        });
        it('should not output trace when level set to debug or higher', function () {
            testNegativeOutput(O.LogLevel.TRACE, O.trace);
        });
    });

    /**
     * DEBUG functionality
     * #d()
     * #debug()
     */
    describe('#d()', function () {
        it('should output debug when level set to debug or lower', function () {
            testPositiveOutput(O.LogLevel.DEBUG, O.d, 'd');
        });
        it('should not output debug when level set to info or higher', function () {
            testNegativeOutput(O.LogLevel.DEBUG, O.d);
        });
    });

    describe('#debug()', function () {
        it('should output debug when level set to debug or lower', function () {
            testPositiveOutput(O.LogLevel.DEBUG, O.debug, 'debug');
        });
        it('should not output debug when level set to info or higher', function () {
            testNegativeOutput(O.LogLevel.DEBUG, O.debug);
        });
    });

    /**
     * INFO functionality
     * #i()
     * #info()
     */
    describe('#i()', function () {
        it('should output info when level set to info or lower', function () {
            testPositiveOutput(O.LogLevel.INFO, O.i, 'i');
        });
        it('should not output info when level set to warn or higher', function () {
            testNegativeOutput(O.LogLevel.INFO, O.i);
        });
    });

    describe('#info()', function () {
        it('should output info when level set to info or lower', function () {
            testPositiveOutput(O.LogLevel.INFO, O.info, 'info');
        });
        it('should not output info when level set to warn or higher', function () {
            testNegativeOutput(O.LogLevel.INFO, O.info);
        });
    });

    /**
     * WARN functionality
     * #w()
     * #warn()
     */
    describe('#w()', function () {
        it('should output warn when level set to warn or lower', function () {
            testPositiveOutput(O.LogLevel.WARN, O.w, 'w');
        });
        it('should not output warn when level set to error or higher', function () {
            testNegativeOutput(O.LogLevel.WARN, O.w);
        });
    });

    describe('#warn()', function () {
        it('should output warn when level set to warn or lower', function () {
            testPositiveOutput(O.LogLevel.WARN, O.warn, 'warn');
        });
        it('should not output warn when level set to error or higher', function () {
            testNegativeOutput(O.LogLevel.WARN, O.warn);
        });
    });

    /**
     * ERROR functionality
     * #e()
     * #error()
     */
    describe('#e()', function () {
        it('should output error when level set to error or lower', function () {
            testPositiveOutput(O.LogLevel.ERROR, O.e, 'e');
        });
        it('should not output error when level set to fatal or higher', function () {
            testNegativeOutput(O.LogLevel.ERROR, O.e);
        });
    });

    describe('#error()', function () {
        it('should output error when level set to error or lower', function () {
            testPositiveOutput(O.LogLevel.ERROR, O.error, 'error');
        });
        it('should not output error when level set to fatal or higher', function () {
            testNegativeOutput(O.LogLevel.ERROR, O.error);
        });
    });

    /**
     * FATAL functionality
     * #f()
     * #fatal()
     */
    describe('#f()', function () {
        it('should output fatal when level set to fatal or lower', function () {
            testPositiveOutput(O.LogLevel.FATAL, O.f, 'f');
        });
        it('should always output fatal', function () {
            testNegativeOutput(O.LogLevel.FATAL, O.f);
        });
    });

    describe('#fatal()', function () {
        it('should output fatal when level set to fatal or lower', function () {
            testPositiveOutput(O.LogLevel.FATAL, O.fatal, 'fatal');
        });
        it('should always output fatal', function () {
            testNegativeOutput(O.LogLevel.FATAL, O.fatal);
        });
    });
});
