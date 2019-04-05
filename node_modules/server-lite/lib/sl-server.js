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

const http = require('http');
const https = require('https');

const stringz = require('string-utilz');

const slConfig = require('./sl-config');

/**
 * Abstraction of a Server, can be implemented simply
 * 
 * @see {slHttpServer}
 * @see {slHttpsServer}
 * @see {slConfig}
 */
class slServer {
    constructor(cfg) {
        this._config = cfg || new slConfig();
        this._server = null;
    }

    get server() { return this._server; }

    _start(svr) {
        this._config.out.d('Starting server...');
        this._server = svr
            .on('checkContinue', this._config.onCheckContinue)
            .on('checkExpectation', this._config.onCheckExpectation)
            .on('clientError', this._config.onClientError)
            .on('close', this._config.onClose)
            .on('connect', this._config.onConnect)
            .on('connection', this._config.onConnection)
            .on('error', this._config.onError)
            .on('upgrade', this._config.onUpgrade)
            .listen(this._config.listenOptions, this._config.onListening);
        this._config.out.i(stringz.fmt('Server started on port %{s}', this._config.listenOptions.port));
    }

    stop() {
        this._config.out.d('Stopping server...');
        this._server.close();
        this._config.out.i('Server has stopped.');
    }
}

/**
 * Implementation of an HTTP server.
 * 
 * constructor takes an {slConfig} object, and uses that to define the server on #start()
 * 
 * @see {slServer}
 * @see {slConfig}
 */
class slHttpServer extends slServer {
    constructor(cfg) { super(cfg); }

    start() { super._start(http.createServer(this._config.onRequest)); }
}

/**
 * Implementation of an HTTPS server.
 * 
 * constructor takes an {slConfig} object, and uses that to define the server on #start()
 * 
 * @see {slServer}
 * @see {slConfig}
 */
class slHttpsServer extends slServer {
    constructor(cfg) { super(cfg); }

    start() { super._start(https.createServer(this._config.httpsOpts, this._config.onRequest)); }
}

module.exports = {
    slServer: slServer,
    http: slHttpServer,
    https: slHttpsServer
};
