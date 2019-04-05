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
 * Configuration for a ServerLite object.  Closely follows the defaults at the moment
 * 
 * @param {Hash} => elements to override
 * possible params are: 
 *   out {output-manager} => extension or implementation of {output-manager} npm.
 *      defaults to `require('output-manager')`
 *   httpsOptions {Hash} => options for the HTTPS config. Links provided below.
 *        defaults to `{}`
 *   listenOptions {Hash} => options to configure server listen
 *     port {number} => port server should be published on.
 *        defaults to `5000`
 *     host {string} => hostname to bind to, will use 0.0.0.0 (IPv4) or :: (IPv6) otherwise
 *        no default 
 *     backlog {number} => max queue length of pending connections, should be determined by system
 *        defaults to 511 (net.Server default)
 *     path {string} => specifies a unix socket
 *        no default 
 *     exclusive {boolean} => allows (false) or denies (true) underlying handle sharing
 *        defaults to `false` (net.Server default)
 * 
 * @see {http}
 * @see https://nodejs.org/api/http.html
 * @see {https}
 * @see https://nodejs.org/api/https.html
 * @see {output-manager}
 * @see https://github.com/MaddHacker/output-manager
 * @see https://nodejs.org/api/net.html#net_server_listen_options_callback
 * @see https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
 * @see https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options
 * 
 */
class slConfig {

    constructor(params) {
        params = params || {};
        // {ouput-manager}
        this.out = (params.out || (new (require('output-manager')).Out()));
        // https options => punting as there are so many
        this.httpsOptions = (params.httpsOpts || {});
        // configuration for the server
        this.listenOptions = {};
        // port
        this.listenOptions.port = (params.port || 5000);
        // host => only set if present
        if (params.host) { this.listenOptions.host = (params.host); }
        // backlog => only set if present
        if (params.backlog) { this.listenOptions.backlog = params.backlog; }
        // path => only set if present
        if (params.path) { this.listenOptions.path = params.path; }
        // exclusive => only set if present
        if (params.exclusive) { this.listenOptions.exclusive = params.exclusive; }

        /**
         * Emitted when check 100 Continue is Emitted
         * 
         * SHOULD NOT BE OVERRIDDEN WITHOUT CAUSE
         * 
         * @param request {http.Request} => request object
         * @param response {http.Response} => response object
         */
        this.onCheckContinue = (params.onCheckContinue || ((request, response) => { this.out.i('onCheckContinue emitted'); response.writeContinue(); }));

        /**
         * Emitted when a check is emitted that isn't status 100
         * 
         * @param request {http.Request} => request object
         * @param response {http.Response} => response object
         */
        this.onCheckExpectation = (params.onCheckExpectation || ((request, response) => { this.out.t('onCheckExpectation emitted'); response.statusCode = 417; response.statusMessage = 'Exception Failed'; response.end(); }));

        /**
         * Emitted on clientError, should be overridden as needed.
         * 
         * @param error {Error} => detailed error
         * @param socket {net.Socket} => object the error came from 
         */
        this.onClientError = (params.onClientError || ((error, socket) => { this.out.e('onClientError emitted with error: ' + error); socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'); }));

        /**
         * Emitted when the server is closed, should be overriden as needed
         */
        this.onClose = (params.onClose || (() => { this.out.t('onClose emitted'); }));

        /**
         * Emitted each time an HTTP CONNECT is emitted
         * 
         * @param request {http.IncomingMessage} => args for the HTTP request
         * @param socket {Socket} => between server and client
         * @param head {Buffer} => first packet of tunnel (may be empty)
         */
        this.onConnect = (params.onConnect || ((request, socket, head) => { this.out.t('onConnect emitted'); }));

        /**
         * Emitted when a new TCP stream is established
         * 
         * @param socket {net.Socket} => socket establishing stream
         */
        this.onConnection = (params.onConnection || ((socket) => { this.out.t('onConnection emitted'); }));

        /**
         * Emitted when there is an error starting the server
         * 
         * @param error {Error} => detailed error object
         */
        this.onError = (params.onError || ((error) => { this.out.e('onError emitted with error: ' + error); }));

        /**
         * Emitted when server#listen() is called successfully.
         */
        this.onListening = (params.onListening || (() => { this.out.t('onListening emitted'); }));

        /**
         * Emitted when the server recieves a request, should be overridden
         * 
         * @param request {http.Request} => request object
         * @param response {http.Response} => response object
         */
        this.onRequest = (params.onRequest || ((request, response) => { this.out.i('onRequest emitted'); }));

        /**
         * Emitted for every HTTP upgrade request
         * 
         * @param request {http.IncomingMessage} => args for the HTTP request
         * @param socket {net.Socket} => socket between server and client
         * @param head {Buffer} => First packet (might be empty)
         */
        this.onUpgrade = (params.onUpgrade || ((request, socket, head) => { this.out.t('onUpgrade emitted'); request.close(); }));
    }

}

/**
 * All exports
 */
module.exports = slConfig;
