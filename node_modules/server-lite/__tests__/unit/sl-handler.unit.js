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

const promise = require('promise');

const stringz = require('string-utilz');
const om = require('output-manager');
const out = new om.Out();

const con = require('../../lib/sl-content');
const utilz = new (require('../../lib/sl-utils'))(out);
const handler = new (require('../../lib/sl-handler'))(utilz);

class Request {
    constructor(path) {
        this.url = path || '/';
    }
}

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
const nonexistantFile = '__test/nope.bin';

const webappRoot = '__test/webapp';
handler.webRoot = webappRoot;

const indexPath = '/html/index.html';
handler.indexPath = indexPath;

const jsConcatPath = '/js/concat/';
handler.concatenateJavscriptFolderPath = jsConcatPath;

const cssConcatPath = '/css/concat/';
handler.concatenateCssFolderPath = cssConcatPath;

/**
 * Tired of doing this all over the place...
 */
function checkResp(resp, mime, status, dataStr) {
    return new promise((fulfill) => {
        let check = () => {
            if (resp._statusCode == 0) { setTimeout(check, 100); }
            else {
                expect(resp._head['Server']).toBe('server-lite');
                expect(resp._head['Content-Language']).toBe('en');
                expect(resp._head['Content-Type']).toBe(mime + '; charset=utf-8');
                expect(resp._statusCode).toBe(status);
                if (dataStr) {
                    expect(resp._content.toString('utf8')).toBe(dataStr);
                } else {
                    // probably not string data
                    expect(resp._content).not.toBeNull();
                }
                expect(resp._encoding).toBe('utf-8');
                fulfill();
            }
        };
        check();
    });
};

describe('sl-handler (Unit)', () => {
    describe('Check no slUtils given on construtor', () => {
        it('should use a default implemenation of slUtils when no slUtils given on constructor', () => {
            let tmpHandler = new (require('../../lib/sl-handler'))();
            expect(tmpHandler._logInfo()).toBe(true);
        });
    });
    describe('Check given slUtils defaults', () => {
        it('should use a given implemenation of slUtils given on constructor', () => {
            expect(handler._logInfo()).toBe(true);
        });
    });
    describe('Check get/set webRoot', () => {
        it('should have no webRoot set to start', () => {
            let tmpHandler = new (require('../../lib/sl-handler'))();
            expect(tmpHandler.webRoot).toBe('');
            expect(tmpHandler._webappRoot).toBe('');
            expect(tmpHandler._webappRoot).toBe(tmpHandler.webRoot);
        });
        it('should get/set webRoot when given/asked', () => {
            handler.webRoot = webappRoot;
            expect(handler.webRoot).toBe(webappRoot);
            expect(handler._webappRoot).toBe(webappRoot);
            expect(handler._webappRoot).toBe(handler.webRoot);
        });
    });
    describe('Check get/set indexPath', () => {
        it('should have no indexPath set to start', () => {
            let tmpHandler = new (require('../../lib/sl-handler'))();
            expect(tmpHandler.indexPath).toBe('');
            expect(tmpHandler._indexPath).toBe('');
            expect(tmpHandler._indexPath).toBe(tmpHandler.indexPath);
        });
        it('should get/set indexPath when given/asked', () => {
            handler.indexPath = indexPath;
            expect(handler.indexPath).toBe(indexPath);
            expect(handler._indexPath).toBe(indexPath);
            expect(handler._indexPath).toBe(handler.indexPath);
        });
    });
    describe('Check get/set concatenateJavscriptFolderPath', () => {
        it('should have no concatenateJavscriptFolderPath set to start', () => {
            let tmpHandler = new (require('../../lib/sl-handler'))();
            expect(tmpHandler.concatenateJavscriptFolderPath).toBe('');
            expect(tmpHandler._concatJsFolderPath).toBe('');
            expect(tmpHandler._concatJsFolderPath).toBe(tmpHandler.concatenateJavscriptFolderPath);
        });
        it('should get/set concatenateJavscriptFolderPath when given/asked', () => {
            handler.concatenateJavscriptFolderPath = jsConcatPath;
            expect(handler.concatenateJavscriptFolderPath).toBe(jsConcatPath);
            expect(handler._concatJsFolderPath).toBe(jsConcatPath);
            expect(handler._concatJsFolderPath).toBe(handler.concatenateJavscriptFolderPath);
        });
    });
    describe('Check get/set concatenateCssFolderPath', () => {
        it('should have no concatenateCssFolderPath set to start', () => {
            let tmpHandler = new (require('../../lib/sl-handler'))();
            expect(tmpHandler.concatenateCssFolderPath).toBe('');
            expect(tmpHandler._concatCssFolderPath).toBe('');
            expect(tmpHandler._concatCssFolderPath).toBe(tmpHandler.concatenateCssFolderPath);
        });
        it('should get/set concatenateCssFolderPath when given/asked', () => {
            handler.concatenateCssFolderPath = cssConcatPath;
            expect(handler.concatenateCssFolderPath).toBe(cssConcatPath);
            expect(handler._concatCssFolderPath).toBe(cssConcatPath);
            expect(handler._concatCssFolderPath).toBe(handler.concatenateCssFolderPath);
        });
    });
    describe('Check get URL path', () => {
        it('should return / on basic path', () => {
            expect(handler._getUrlPath(new Request())).toBe('/');
        });
        it('should be able to get more complex paths', () => {
            expect(handler._getUrlPath(new Request('/test/123/bob.js'))).toBe('/test/123/bob.js');
        });
    });
    describe('Check get query', () => {
        it('should return empty on no query', () => {
            expect(JSON.stringify(handler._getQuery(new Request()))).toBe('{}');
            expect(JSON.stringify(handler._getQuery(new Request('/test/123/bob.js')))).toBe('{}');
        });
        it('should be able to get a given query', () => {
            expect(JSON.stringify(handler._getQuery(new Request('/?files=1')))).toBe(JSON.stringify({ "files": "1" }));
            expect(JSON.stringify(handler._getQuery(new Request('/?files=1&name=bob')))).toBe(JSON.stringify({ "files": "1", "name": "bob" }));
            expect(JSON.stringify(handler._getQuery(new Request('/?files=1,2,3,4,5')))).toBe(JSON.stringify({ "files": "1,2,3,4,5" }));
            expect(JSON.stringify(handler._getQuery(new Request('/test/123/bob.js?files=1,2,3,4,5')))).toBe(JSON.stringify({ "files": "1,2,3,4,5" }));
        });
    });
    describe('Check simpleFileBasedWebServer', () => {
        it('should use the index path when path is /', (done) => {
            let resp = new Response();
            handler.simpleFileBasedWebServer(new Request(), resp);
            checkResp(resp, con.mimeTypes['html'], 200, 'index.html').then(() => { done(); });
        });
        it('should load the index path when requested', (done) => {
            let resp = new Response();
            handler.simpleFileBasedWebServer(new Request('/html/index.html'), resp);
            checkResp(resp, con.mimeTypes['html'], 200, 'index.html').then(() => { done(); });
        });
        it('should load a css file when requested', (done) => {
            let resp = new Response();
            handler.simpleFileBasedWebServer(new Request('/css/main.css'), resp);
            checkResp(resp, con.mimeTypes['css'], 200, 'main.css').then(() => { done(); });
        });
        it('should load a js file when requested', (done) => {
            let resp = new Response();
            handler.simpleFileBasedWebServer(new Request('/js/main.js'), resp);
            checkResp(resp, con.mimeTypes['js'], 200, 'main.js').then(() => { done(); });
        });
        it('should load a jpg file when requested', (done) => {
            let resp = new Response();
            handler.simpleFileBasedWebServer(new Request('/img/mh.jpg'), resp);
            checkResp(resp, con.mimeTypes['jpg'], 200, null).then(() => { done(); });
        });
    });
    describe('Check concatenatedJavscript', () => {
        it('should return 404 when no files requested', (done) => {
            let resp = new Response();
            handler.concatenatedJavscript(new Request(), resp);
            checkResp(resp, 'text/plain', 404, 'Requested a concatenated .js file but did not provide files to concat!').then(() => { done(); });
        });
        it('should return 404 when no "files" is in query requested', (done) => {
            let resp = new Response();
            handler.concatenatedJavscript(new Request('/concat.js?file=1'), resp);
            checkResp(resp, 'text/plain', 404, 'Requested a concatenated .js file but did not provide files to concat!').then(() => { done(); });
        });
        it('should return 200 when files are requested', (done) => {
            let resp = new Response();
            handler.concatenatedJavscript(new Request('/concat.js?files=1,2'), resp);
            checkResp(resp, con.mimeTypes['js'], 200, '1.js2.js').then(() => { done(); });
        });
        it('should return files in the order that they are requested', (done) => {
            let resp = new Response();
            handler.concatenatedJavscript(new Request('/concat.js?files=2,1'), resp);
            checkResp(resp, con.mimeTypes['js'], 200, '2.js1.js').then(() => { done(); });
        });
        it('should return only files that are requested', (done) => {
            let resp = new Response();
            handler.concatenatedJavscript(new Request('/concat.js?files=2'), resp);
            checkResp(resp, con.mimeTypes['js'], 200, '2.js').then(() => { done(); });
        });
        it('should use an empty string for files not found', (done) => {
            let resp = new Response();
            handler.concatenatedJavscript(new Request('/concat.js?files=3'), resp);
            checkResp(resp, con.mimeTypes['js'], 200, '').then(() => { done(); });
        });
    });
    describe('Check concatenatedCss', () => {
        it('should return 404 when no files requested', (done) => {
            let resp = new Response();
            handler.concatenatedCss(new Request(), resp);
            checkResp(resp, 'text/plain', 404, 'Requested a concatenated .css file but did not provide files to concat!').then(() => { done(); });
        });
        it('should return 404 when no "files" is in query requested', (done) => {
            let resp = new Response();
            handler.concatenatedCss(new Request('/concat.css?file=1'), resp);
            checkResp(resp, 'text/plain', 404, 'Requested a concatenated .css file but did not provide files to concat!').then(() => { done(); });
        });
        it('should return 200 when files are requested', (done) => {
            let resp = new Response();
            handler.concatenatedCss(new Request('/concat.css?files=1,2'), resp);
            checkResp(resp, con.mimeTypes['css'], 200, '1.css2.css').then(() => { done(); });
        });
        it('should return files in the order that they are requested', (done) => {
            let resp = new Response();
            handler.concatenatedCss(new Request('/concat.css?files=2,1'), resp);
            checkResp(resp, con.mimeTypes['css'], 200, '2.css1.css').then(() => { done(); });
        });
        it('should return only files that are requested', (done) => {
            let resp = new Response();
            handler.concatenatedCss(new Request('/concat.css?files=2'), resp);
            checkResp(resp, con.mimeTypes['css'], 200, '2.css').then(() => { done(); });
        });
        it('should use an empty string for files not found', (done) => {
            let resp = new Response();
            handler.concatenatedCss(new Request('/concat.css?files=3'), resp);
            checkResp(resp, con.mimeTypes['css'], 200, '').then(() => { done(); });
        });
    });
});
