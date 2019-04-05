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

/*
 * MAKE Dates USEFUL => Prototypes for Date so it's not as annoying...
 * 
 * To use, simply include:
 *      require('date-utilz');
 * in your main entry point (typically index.js)
 */

const stringz = require('string-utilz');

const dateConst = require('./constants');

//|||jbariel => TODO need to support I18N
const en = new dateConst.en();

/**
 * Shortcut to get the current `Date` as an ISOString
 */
const date = () => { return (new Date()).toISOString(); };

/**
 * Build an 'HTTP-date' (defined in RFC-7231)
 * 
 * @see https://tools.ietf.org/html/rfc7231
 * @see https://tools.ietf.org/html/rfc5322
 */
const httpDate = () => {
    let d = new Date();
    let dow = stringz.fixSize(en.day(d.getDay()), 3);
    let dom = stringz.fixSize(String(d.getDate()), -2, '0');
    let moy = stringz.fixSize(en.month(d.getMonth()), 3);
    let hod = stringz.fixSize(String(d.getHours()), -2, '0');
    let moh = stringz.fixSize(String(d.getMinutes()), -2, '0');
    let som = stringz.fixSize(String(d.getSeconds()), -2, '0');
    let tz = '';
    stringz.chop(d.toString(), 1).split('(')[1].split(' ').forEach((el) => { tz += stringz.fixSize(el, 1) });
    return stringz.fmt('%{s}, %{s} %{s} %{s} %{s}:%{s}:%{s} %{s}', dow, dom, moy, d.getFullYear(), hod, moh, som, tz);
};

/**
 * Padding for a number (converting to string), either left (negative) or right (positive)
 * 
 * @param {number} number to pad
 * @param {number} number of times to repeat given padding character(s)
 * @param {string|number} string to use as a padding character(s).  Defaults to '0' when not provided
 * @return {string} with left padding (if given size is negative) or right padding (if given size is positive).  Will return the string without any padding when size = 0
 * 
 * @see `String-Utilz#pad`
 */
const pad = (tmpNum, size, char) => {
    var tmp = String(tmpNum);
    char = (char == null) ? '0' : String(char);
    return stringz.pad(tmp, size, char);
}

/**
 * Format functionality for Date class
 * 
 * @param {string} first parameter is the format string
 * @param {string...} string(s) to replace
 * @returns {string} with values replaced
 * 
 * @usage Date.fmt('%{s}','bob'); => 'bob'
 * @usage Date.fmt('My %{s} long %{s}','very', 'string'); => 'My very long string'
 * @usage Date.fmt('%{0} says %{1}, thanks %{0}!','Bob', 'Hi'); => 'Bob says Hi, thanks Bob!'
 */
// ||| jbariel TODO
// const fmt = function () {
//     var args = Array.from(arguments);
//     var tmpStr = args.shift(),
//         argIndex = 0;
//     // handle simple indicies
//     tmpStr = tmpStr.replace(/%\{(\d+)\}/g, function (match, group1) {
//         return args[group1];
//     });
//     // handle simple string replacements
//     tmpStr = tmpStr.replace(/%\{s\}/g, function (match, offset, str) {
//         if (str.charAt(offset - 1) != __esc) {
//             return args[argIndex++];
//         }
//         return match;
//     });
//     return tmpStr;
// };

/**
 * Adds the following to the `Date.prototype` if it's not already a function:
 *  - pad
 *  - fmt
 * 
 * Also sets `Date.fmt` = fmt
 * 
 * This is NON-DESTRUCTIVE! If there is already a function defined, no new function will be set.
 */
const addPrototypes = () => {
    if (typeof Date.prototype.pad != 'function')
        Date.prototype.pad = function (num, char) { return pad.call(null, this, num, char); }

    // ||| jbariel TODO
    // if (typeof Date.prototype.fmt != 'function')
    //     Date.prototype.fmt = function () { return fmt.apply(null, [this].concat(Array.from(arguments))); }

    // if (typeof Date.fmt != 'function')
    //     Date.fmt = fmt;
}

module.exports = {
    date: date,
    httpDate: httpDate,
    pad: pad,
    addDatePrototypes: addPrototypes
};
