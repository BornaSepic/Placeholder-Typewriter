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

const stringz = require('string-utilz');
const om = require('output-manager');
const out = new om.Out();

const con = require('../../lib/sl-content');
const utilz = new (require('../../lib/sl-utils'))(out);

class Response {
    constructor() {
        this._head = {};
        this._statusCode = 0;
        this._content = '';
        this._encoding = '';
    }

    writeHead(code, headers) {
        this._statusCode = code;
        this._head = headers;
    }

    end(data, encoding) {
        this._content = data;
        this._encoding = encoding;
    }
}

const knownFile = '__test/testfile.out';
const nonexistantFile = '__test/nope.bin'

describe('sl-utils (Unit)', () => {
    describe('Check no output given on construtor', () => {
        it('should use a default implemenation of output-manager when no output given on constructor', () => {
            let tmpUtilz = new (require('../../lib/sl-utils'))();
            expect(tmpUtilz.errStr({ name: 'hi', message: 'bob' })).toBe('hi - bob');
        });
    });
    describe('Check errStr', () => {
        it('should return a sensible string', () => {
            expect(utilz.errStr({ name: 'hi', message: 'bob' })).toBe('hi - bob');
        });
    });
    describe('Check buildFromFilePath', () => {
        it('should handle known strings (xml)', () => {
            let tmpCon = utilz.buildFromFilePath('docs/latest/wizard.xml', 'data');
            expect(tmpCon).not.toBeNull();
            expect(tmpCon.type).toBe('application/xml; charset=utf-8');
            expect(tmpCon.length).toBe(4);
        });
        it('should handle known strings (js)', () => {
            let tmpCon = utilz.buildFromFilePath('scripts/raw/fun.min.js', 'data');
            expect(tmpCon).not.toBeNull();
            expect(tmpCon.type).toBe('application/javascript; charset=utf-8');
            expect(tmpCon.length).toBe(4);
        });
        it('should handle unknown strings (boo)', () => {
            let tmpCon = utilz.buildFromFilePath('ghost/says.boo', 'data');
            expect(tmpCon).not.toBeNull();
            expect(tmpCon.type).toBe('application/octet-stream; charset=utf-8');
            expect(tmpCon.length).toBe(4);
        });
    });
    describe('Check loadDataFromFile', () => {
        it('should throw an error when a file does not exist', (done) => {
            utilz.loadDataFromFile(nonexistantFile).then(
                () => { throw Error('should not be sucessful trying to open ' + nonexistantFile); },
                (err) => {
                    expect(err).not.toBeNull();
                    done();
                },
                () => { throw Error('should not have tried to read ' + nonexistantFile); });
        });
        it('should be able to load a file', (done) => {
            utilz.loadDataFromFile(knownFile).then(
                (data) => {
                    expect(data.toString('utf8')).toBe('Say hi!');
                    done();
                },
                (err) => { throw Error('should not have been able to read or find ' + knownFile); },
                (err) => { throw Error('should not have tried to read ' + knownFile); });
        });
    });
    describe('Check respondWithFileFromPath', () => {
        it('should return a 404 when a file does not exist', (done) => {
            let myResponse = new Response();
            utilz.respondWithFileFromPath(nonexistantFile, myResponse);
            expect(myResponse._statusCode).toBe(0);
            let checkResponse = () => {
                if (myResponse._statusCode == 0) { setTimeout(checkResponse, 100); }
                else {
                    expect(myResponse._head['Server']).toBe('server-lite');
                    expect(myResponse._head['Content-Language']).toBe('en');
                    expect(myResponse._head['Content-Type']).toBe('text/plain; charset=utf-8');
                    expect(myResponse._statusCode).toBe(404);
                    expect(stringz.startsWith(myResponse._content, 'File at')).toBe(true);
                    expect(myResponse._encoding).toBe('utf-8');
                    done();
                }
            };
            checkResponse();
        });
        it('should be able to load a file', (done) => {
            let myResponse = new Response();
            utilz.respondWithFileFromPath(knownFile, myResponse);
            expect(myResponse._statusCode).toBe(0);
            let checkResponse = () => {
                if (myResponse._statusCode == 0) { setTimeout(checkResponse, 100); }
                else {
                    expect(myResponse._head['Server']).toBe('server-lite');
                    expect(myResponse._head['Content-Language']).toBe('en');
                    expect(myResponse._head['Content-Type']).toBe('application/octet-stream; charset=utf-8');
                    expect(myResponse._statusCode).toBe(200);
                    expect(myResponse._content.toString('utf8')).toBe('Say hi!');
                    expect(myResponse._encoding).toBe('utf-8');
                    done();
                }
            };
            checkResponse();
        });
    });
    describe('Check writeResponse', () => {
        it('should handle good input', () => {
            let myResponse = new Response();
            utilz.writeResponse(myResponse, 200, con.text('say hi'));
            expect(myResponse._head).not.toBeNull();
            expect(myResponse._head['Server']).toBe('server-lite');
            expect(myResponse._head['Content-Language']).toBe('en');
            expect(myResponse._head['Content-Length']).toBe(6);
            expect(myResponse._head['Content-Type']).toBe('text/plain; charset=utf-8');
            expect(myResponse._head['Date']).not.toBeNull();
            expect(myResponse._statusCode).toBe(200);
            expect(myResponse._content).toBe('say hi');
            expect(myResponse._encoding).toBe('utf-8');
        });
        it('should be able to handle no status', () => {
            let myResponse = new Response();
            utilz.writeResponse(myResponse, null, con.text('say hi'));
            expect(myResponse._head).not.toBeNull();
            expect(myResponse._head['Server']).toBe('server-lite');
            expect(myResponse._head['Content-Language']).toBe('en');
            expect(myResponse._head['Content-Length']).toBe(6);
            expect(myResponse._head['Content-Type']).toBe('text/plain; charset=utf-8');
            expect(myResponse._head['Date']).not.toBeNull();
            expect(myResponse._statusCode).toBe(500);
            expect(myResponse._content).toBe('say hi');
            expect(myResponse._encoding).toBe('utf-8');
        });
        it('should be able to handle no content', () => {
            let myResponse = new Response();
            utilz.writeResponse(myResponse, 404, null);
            expect(myResponse._head).not.toBeNull();
            expect(myResponse._head['Server']).toBe('server-lite');
            expect(myResponse._head['Content-Language']).toBe('en');
            expect(myResponse._head['Content-Length']).toBe(19);
            expect(myResponse._head['Content-Type']).toBe('text/plain; charset=utf-8');
            expect(myResponse._head['Date']).not.toBeNull();
            expect(myResponse._statusCode).toBe(404);
            expect(myResponse._content).toBe('No content returned');
            expect(myResponse._encoding).toBe('utf-8');
        });
    });
});
