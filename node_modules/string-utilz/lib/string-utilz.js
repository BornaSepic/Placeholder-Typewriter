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
 * MAKE STRINGS USEFUL => (optional) Prototypes for String so it's not as annoying...
 * 
 * To use, simply include:
 *      require('string-utilz');
 * in your main entry point (typically index.js)
 */

/* #fmt constants */
const __open = '%{';
const __close = '}';
const __esc = '%';

/**
 * Simple method to escape all special RegExp fxns
 * 
 * Special values:
 *  - [ ] / { } ( ) * + ? . \ ^ $ |
 * 
 * @param {string} tmpStr to escape
 * @returns {string} with all special values escaped
 */
const escapeRegEx = (tmpStr) => { return tmpStr.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }

/**
 * Abstract away RegEx management...
 * 
 * @param {string} tmpStr to escape
 * @param {string} flags RegEx flags requested
 * @return {RegExp} escaped string RegExp with given flags 
 * 
 * @see #escapeRegEx(tmpStr)
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Advanced_searching_with_flags
 */
const generateRegEx = (tmpStr, flags) => { return new RegExp(escapeRegEx(tmpStr), flags || ''); }

/**
 * Generic replace to make code climate happier (and code more DRY)
 * 
 * @param {string} tmpStr string to do the 'replace old with new' on
 * @param {string} oldStr string to replace
 * @param {string} newStr string to replace with
 * @param {string} flags RegExp flags
 * @return {string}
 * 
 * @see #generateRegEx(tmpStr, flags)
 * @see #escapeRegEx(tmpStr)
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Advanced_searching_with_flags
 */
const replaceAllGeneric = (tmpStr, oldStr, newStr, flags) => { return tmpStr.replace(generateRegEx(oldStr, flags), newStr); }

/**
 * starts with functionality
 * 
 * @param {string} tmpStr string to check
 * @param {string} matchStr string to match against
 * @returns {boolean} <b>true</b> if this ends with string, <b>false</b> otherwise
 * 
 * @usage 'bob'.startsWith('b'); => true
 * @usage 'A long string'.startsWith('A lon') => true
 * @usage 'A long string'.startsWith('A lone') => false
 */
const startsWith = (tmpStr, matchStr) => { return tmpStr.slice(0, matchStr.length) == matchStr; }

/**
 * ends with functionality
 * 
 * @param {string} tmpStr string to check
 * @param {string} matchStr string to match against
 * @returns {boolean} <b>true</b> if this ends with string, <b>false</b> otherwise
 * 
 * @usage 'bob'.endsWith('b'); => true
 * @usage 'A long string'.endsWith('string') => true
 * @usage 'A long string'.endsWith('a string') => false
 */
const endsWith = (tmpStr, matchStr) => { return tmpStr.slice(-matchStr.length) == matchStr; }

/**
 * Simple true/false to tell if the given string matches (ignoring case)
 * some subset of <b>this</b> string
 * 
 * @param {string} tmpStr string to check
 * @param {string} matchStr string to match against (ignoring case)
 * @returns {boolean} <b>true</b> if the string is contained (without matching case), <b>false</b> otherwise
 * 
 * @usage 'my string'.containsIgnoreCase('str') => true
 * @usage 'my long string'.containsIgnoreCase('long') => true
 * @usage 'my long string'.containsIgnoreCase('LONG') => true
 * @usage 'my super long string'.containsIgnoreCase('rings') => false
 */
const containsIgnoreCase = (tmpStr, matchStr) => { return tmpStr.search(generateRegEx(matchStr, 'i')) > -1; }

/**
 * Replace all functionality
 * 
 * @param {string} tmpStr string to do the 'replace old with new' on
 * @param {string} oldStr string to replace
 * @param {string} newStr string to replace with
 * @returns {string} with values replaced
 * 
 * @usage 'bob'.replaceAll('b','m'); => 'mom'
 * @usage 'My very long string'.replaceAll(' ','_'); => 'My_very_long_string'
 */
const replaceAll = (tmpStr, oldStr, newStr) => { return replaceAllGeneric(tmpStr, oldStr, newStr, 'g'); }

/**
 * Replace all functionality that ignores case
 * 
 * @param {string} tmpStr string to do the 'replace old with new' on
 * @param {string} oldStr string to replace
 * @param {string} newStr string to replace with
 * @returns {string} with values replaced
 * 
 * @usage 'Bob'.replaceAll('b','m'); => 'mom'
 * @usage 'My very long string'.replaceAll(' ','_'); => 'My_very_long_string'
 */
const replaceAllIgnoreCase = (tmpStr, oldStr, newStr) => { return replaceAllGeneric(tmpStr, oldStr, newStr, 'gi'); }

/**
 * Multiplication for a given string.
 * 
 * @param {string} string to multiply
 * @param {number} number of times to multiply string
 * @return {string} that is multiplied the given number of times.  Multiplying by 0 will return {null}.  Multiplying by a negative number or 1 will return the given string only
 * 
 * @usage '*'.times(2); => '**'
 * @usage '*'.times(0); => `null`
 */
const times = (tmpStr, num) => {
    var tmpRtn = tmpStr;
    if (num == 0) {
        tmpRtn = null;
    } else if (num > 1) {
        for (var i = 1; i < num; i++) {
            tmpRtn += tmpStr;
        }
    }
    return tmpRtn;
};

/**
 * Padding for a string, either left (negative) or right (positive)
 * 
 * @param {string} string to pad
 * @param {number} number of times to repeat given padding character(s)
 * @param {string} string to use as a padding character(s).  Defaults to ' ' (empty string) when not provided
 * @return {string} with left padding (if given size is negative) or right padding (if given size is positive).  Will return the string without any padding when size = 0
 * 
 * @usage '*'.pad(1,'-'); => '*-'
 * @usage '*'.pad(-1,'-'); => '-*'
 */
const pad = (tmpStr, size, char) => {
    if (size == 0)
        return tmpStr;
    char = char || ' ';
    var padding = times(char, Math.abs(size));
    return ((size > 0) ? (tmpStr + padding) : (padding + tmpStr));
};

/**
 * Chops a string => used to "trim" characters from the end (positive number) or beginning (negative number) of a given string
 * 
 * @param {string} string to chop
 * @param {number} number of characters to remove from the beginning (<0) or end (>0)
 * @return {string} chopped string, or `null` if `size` > `tmpStr.length`
 * 
 * @usage 'testing'.chop(3); => 'test'
 * @usage 'testing'.chop(-4); => 'ing'
 */
const chop = (tmpStr, size) => {
    var absSize = Math.abs(size);
    var rtn = null;
    if (tmpStr.length - absSize > 0) {
        var start = ((size < 0) ? absSize : 0);
        var end = ((size > 0) ? (tmpStr.length - absSize) : tmpStr.length);
        rtn = tmpStr.substring(start, end);
    }
    return rtn;
};

/**
 * Creates a fixed sized string by chopping or padding it as needed.
 * 
 * @param {string} string to fix size of
 * @param {number} number of characters the string should have.  Negative notes any chopping/padding starts left, positive starts all chopping/padding from the right
 * @param {string} char 
 * 
 * @see #chop(tmpStr, size)
 * @see #pad(tmpStr, size, char)
 */
const fixSize = (tmpStr, size, char) => {
    var rtn = tmpStr;
    if (size == 0) {
        rtn = null;
    } else {
        var diff = tmpStr.length - Math.abs(size);
        var sign = (size < 0) ? -1 : 1;
        if (diff > 0) {
            rtn = chop(tmpStr, diff * sign);
        } else if (diff < 0) {
            rtn = pad(tmpStr, Math.abs(diff) * sign, char)
        }
    }
    return rtn;
};

/**
 * Format functionality for String class
 * 
 * @param {string} first parameter is the format string
 * @param {string...} string(s) to replace
 * @returns {string} with values replaced
 * 
 * @usage String.fmt('%{s}','bob'); => 'bob'
 * @usage String.fmt('My %{s} long %{s}','very', 'string'); => 'My very long string'
 * @usage String.fmt('%{0} says %{1}, thanks %{0}!','Bob', 'Hi'); => 'Bob says Hi, thanks Bob!'
 */
const fmt = function () {
    var args = Array.from(arguments);
    var tmpStr = args.shift(),
        argIndex = 0;
    // handle simple indicies
    tmpStr = tmpStr.replace(/%\{(\d+)\}/g, function (match, group1) {
        return args[group1];
    });
    // handle simple string replacements
    tmpStr = tmpStr.replace(/%\{s\}/g, function (match, offset, str) {
        if (str.charAt(offset - 1) != __esc) {
            return args[argIndex++];
        }
        return match;
    });
    return tmpStr;
};

/**
 * Adds the following to the `String.prototype` if it's not already a function:
 *  - startsWith
 *  - endsWith
 *  - containsIgnoreCase
 *  - replaceAll
 *  - replaceAllIgnoreCase
 *  - escapeRegEx
 *  - times
 *  - pad
 *  - chop
 *  - fixSize
 *  - fmt
 * 
 * Also sets `String.fmt` = fmt
 * 
 * This is NON-DESTRUCTIVE! If there is already a function defined, no new function will be set.
 */
const addPrototypes = () => {
    if (typeof String.prototype.startsWith != 'function')
        String.prototype.startsWith = function (matchStr) { return startsWith.call(null, this, matchStr); }

    if (typeof String.prototype.endsWith != 'function')
        String.prototype.endsWith = function (matchStr) { return endsWith.call(null, this, matchStr); }

    if (typeof String.prototype.containsIgnoreCase != 'function')
        String.prototype.containsIgnoreCase = function (matchStr) { return containsIgnoreCase.call(null, this, matchStr); }

    if (typeof String.prototype.replaceAll != 'function')
        String.prototype.replaceAll = function (oldStr, newStr) { return replaceAll.call(null, this, oldStr, newStr); }

    if (typeof String.prototype.replaceAllIgnoreCase != 'function')
        String.prototype.replaceAllIgnoreCase = function (oldStr, newStr) { return replaceAllIgnoreCase.call(null, this, oldStr, newStr); }

    if (typeof String.prototype.escapeRegEx != 'function')
        String.prototype.escapeRegEx = function () { return escapeRegEx.call(null, this); }

    if (typeof String.prototype.times != 'function')
        String.prototype.times = function (size) { return times.call(null, this, size); }

    if (typeof String.prototype.pad != 'function')
        String.prototype.pad = function (size, char) { return pad.call(null, this, size, char); }

    if (typeof String.prototype.chop != 'function')
        String.prototype.chop = function (size) { return chop.call(null, this, size); }

    if (typeof String.prototype.fixSize != 'function')
        String.prototype.fixSize = function (size, char) { return fixSize.call(null, this, size, char); }

    if (typeof String.prototype.fmt != 'function')
        String.prototype.fmt = function () { return fmt.apply(null, [this].concat(Array.from(arguments))); }

    if (typeof String.fmt != 'function')
        String.fmt = fmt;

}

module.exports = {
    startsWith: startsWith,
    endsWith: endsWith,
    containsIgnoreCase: containsIgnoreCase,
    replaceAll: replaceAll,
    replaceAllIgnoreCase: replaceAllIgnoreCase,
    escapeRegEx: escapeRegEx,
    times: times,
    pad: pad,
    chop: chop,
    fixSize: fixSize,
    fmt: fmt,
    addStringPrototypes: addPrototypes
}
