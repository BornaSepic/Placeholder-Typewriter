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

const path = require('path');
const url = require('url');

const stringz = require('string-utilz');

const con = require('./sl-content');

/**
 * Set of request handler methods that should be useful for whomever consumes this npm.
 */
class slHandler {
    /**
     * Takes an instance of slUtils for output and other utilities
     * 
     * @param {slUtils}
     * @param {string} _webappRoot
     * @param {string} _indexPath
     * @param {string} _concatJsFolderPath
     * @param {string} _concatCssFolderPath
     * 
     * @see slUtils
     */
    constructor(utilz, root, index, concatJs, concatCss) {
        this.utilz = utilz || (new (require('./sl-utils'))());
        /* root of the webapp to serve from */
        this._webappRoot = (root || '');
        /* index file */
        this._indexPath = (index || '');
        /* folder where concat js targets live */
        this._concatJsFolderPath = (concatJs || '');
        /* folder where concat css targets live */
        this._concatCssFolderPath = (concatCss || '');
    }

    /**
     * Dumps the properties of this object to the logs at info level
     */
    _logInfo() {
        this.o.d('Utilz: ' + JSON.stringify(this.utilz));
        this.o.d('WebappRoot: ' + this._webappRoot);
        this.o.d('IndexPath: ' + this._indexPath);
        this.o.d('ConcatJsFolderPath: ' + this._concatJsFolderPath);
        this.o.d('ConcatCssFolderPath: ' + this._concatCssFolderPath);
        return true;
    }

    /**
     * Internal shortcut to get the output handle
     * 
     * @return {output-manager} instance
     */
    get o() { return this.utilz._out; }

    /**
     * Get where the webappRoot (on the filesystem) is at the moment
     * 
     * This should be relative to the app root without the leading or trailing slashes
     * 
     * @return {string}
     */
    get webRoot() { return this._webappRoot; }

    /**
     * set a new webappRoot (on the filesystem)
     * 
     * @param {string} root => This should be relative to the app root without the leading or trailing slashes
     */
    set webRoot(root) { this._webappRoot = root; }

    /**
     * Path to the index.html file (relative to the webRoot)
     * 
     * @return {string}
     */
    get indexPath() { return this._indexPath; }

    /**
     * set a new path to the index.html file (relative to the webRoot)
     * 
     * @param {string} path => typically starting with a '/'
     */
    set indexPath(path) { this._indexPath = path; }

    /**
     * path (relative to webRoot) where JavaScript files live that should/can be concatenated
     * 
     * @return {string}
     */
    get concatenateJavscriptFolderPath() { return this._concatJsFolderPath; }

    /**
     * path (relative to webRoot) where JavaScript files live that should/can be concatenated
     * 
     * @param {string}
     */
    set concatenateJavscriptFolderPath(path) { this._concatJsFolderPath = path; }

    /**
     * path (relative to webRoot) where CSS files live that should/can be concatenated
     * 
     * @return {string}
     */
    get concatenateCssFolderPath() { return this._concatCssFolderPath; }

    /**
     * path (relative to webRoot) where CSS files live that should/can be concatenated
     * 
     * @param {string}
     */
    set concatenateCssFolderPath(path) { this._concatCssFolderPath = path; }

    /**
     * Simple helper to parse the urlPath from the request
     * 
     * @param {Http.Request}
     * @return {string}
     */
    _getUrlPath(request) { return url.parse(request.url).pathname; }

    /**
     * simple helper to parse the query object from the request
     * 
     * @param {Http.Request}
     * @return {string}
     */
    _getQuery(request) { return url.parse(request.url, true).query; }

    /**
     * Loads a file and sends it back based on the filesystem
     * 
     * @see {slUtils} #respondWithFileFromPath(filePath,response)}
     */
    simpleFileBasedWebServer(request, response) {
        this.o.t('Called simpleFileBasedWebServer');
        let urlPath = this._getUrlPath(request);
        this.o.d('[simpleFileBasedWebServer] urlPath: ' + urlPath);
        let filePath = this._webappRoot + ((urlPath == '/') ? this._indexPath : urlPath);
        this.o.d('[simpleFileBasedWebServer] filePath: ' + filePath);
        this.utilz.respondWithFileFromPath(filePath, response);
    }

    /**
     * Responds with the concatenated JS file requested in {Http.Request}
     * 
     * @see #concatenateAll
     */
    concatenatedJavscript(request, response) {
        this.o.t('Called concatenatedJavscript');
        this.concatenateAll(request, response, this._concatJsFolderPath, '.js');
    }

    /**
     * Responds with the concatenated CSS file requested in {Http.Request}
     * 
     * @see #concatenateAll
     */
    concatenatedCss(request, response) {
        this.o.t('Called concatenatedCss');
        this.concatenateAll(request, response, this._concatCssFolderPath, '.css');
    }

    /**
     * Does the work of concatenating a series of files as defined in the URL.
     * 
     * Typically a url will look like:
     *      'concat.js?files=a,b,c,d'
     *      'concat.css?files=a,b,c,d'
     * 
     * In each case, the files will be concatenated IN ORDER of request.  This will then return one
     * BIG file as part of the request.
     * 
     * @param {Http.Request}
     * @param {Http.Response}
     * @param {string} folder => folder (relative to webRoot) where all the files to concatenate live
     * @param {string} ext => type of files (e.g. '.js' or '.css' => NOTE: the '.' matters!)
     */
    concatenateAll(request, response, folder, ext) {
        this.o.t(stringz.fmt('Called concatenateAll (%{s})', ext));
        let query = this._getQuery(request);
        if (query && query.files) {
            this.o.d(stringz.fmt('[concatenateAll (%{0})] query: "%{1}"', ext, JSON.stringify(query)));
            let baseDir = this._webappRoot + folder;
            let files = query.files.split(',');
            this.o.d(stringz.fmt('Loading %{0} files from %{1} with extension "%{2}" (%{3})', files.length, folder, ext, files));
            let allData = {};
            // async load all file info
            files.forEach((file) => {
                let tmpPath = this._webappRoot + folder + file + ext;
                this.o.d(stringz.fmt('Trying to load file "%{s}"', tmpPath));
                this.utilz.loadDataFromFile(tmpPath).then((data) => {
                    this.o.d(stringz.fmt('Loaded file data from "%{0}"', tmpPath));
                    allData[file] = data;
                }, (err) => {
                    this.o.w(stringz.fmt('File at "%{0}" does not exist or could not be read. MSG: "%{1}"', tmpPath, err));
                    allData[file] = '';
                });
            });

            // wait for all async processes to finish
            let awaitAll = () => {
                if (Object.keys(allData).length != files.length) { setTimeout(awaitAll, 50); }
                else {
                    let tmpData = '';
                    // load all data in order
                    files.forEach((file) => {
                        this.o.d(stringz.fmt('Adding data from %{0}%{1}', file, ext));
                        this.o.t('==============DATA==============');
                        this.o.t(allData[file]);
                        this.o.t('============END DATA============');
                        tmpData += allData[file];
                    });
                    this.utilz.writeResponse(response, 200, con.byExtension(stringz.chop(ext, -1), tmpData));
                }
            };

            // kick off the await...
            awaitAll();
        } else {
            this.o.w(stringz.fmt('[concatenateAll (%{s})] requested a concat but did not provide files!', ext));
            this.utilz.writeResponse(response, 404, con.text(stringz.fmt('Requested a concatenated %{s} file but did not provide files to concat!', ext)));
        }
    }
}

module.exports = slHandler;
