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

const datez = require('../../lib/date-utilz');
datez.addDatePrototypes();

describe('Date Utils (Unit)', function () {
    /**
    * check datez#pad(tmpStr, num, char)
    */
    describe('datez#date()', function () {
        it('return current date as ISOString', function () {
            expect(datez.date()).not.toBe(null);
        });
    });

    describe('datez#httpDate()', function () {
        it('return current date as HTTP-date string', function () {
            expect(datez.httpDate()).not.toBe(null);
            console.log(datez.httpDate());
        });
    });

    /**
    * check datez#pad(tmpStr, num, char)
    */
    describe('datez#pad(tmpStr, num, char)', function () {
        it('should use a space when no char is provided', function () {
            expect(datez.pad(1, 1)).toBe('10');
        });
        it('should return the given string when num is 0', function () {
            expect(datez.pad(1, 0)).toBe('1');
            expect(datez.pad(1, 0, '-')).toBe('1');
        });
        it('should pad multiple times', function () {
            expect(datez.pad(1, 5)).toBe('100000');

            expect(datez.pad(1, -5, '-')).toBe('-----1');
        });
        it('should pad to the left when negative', function () {
            expect(datez.pad(1, -5)).toBe('000001');
        });
        it('should handle multiple chars', function () {
            expect(datez.pad(10, -2, '000')).toBe('00000010');
            expect(datez.pad(10, 2, 1)).toBe('1011');
            expect(datez.pad(10, 2, '--')).toBe('10----');
        });
    });
});
