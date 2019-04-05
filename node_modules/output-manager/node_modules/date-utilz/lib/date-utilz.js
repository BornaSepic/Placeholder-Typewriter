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

/*
 * MAKE Dates USEFUL => Prototypes for Date so it's not as annoying...
 * 
 * To use, simply include:
 *      require('date-utilz');
 * in your main entry point (typically index.js)
 */

'use strict';

const date = () => { return (new Date()).toISOString(); }

module.exports = {
    date: date
};
