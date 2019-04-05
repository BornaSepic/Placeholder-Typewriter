# Server Lite
This is a lightweight webserver that is meant to take all the complexities out of creating and running a webserver, without losing any of the configuration options.  This has been built to be weakly opinionated, meaning that all of the decisions that are made typically can be modified.  The included utilities and handlers mean that the focus of a user of `server-lite` is on code and functionality, without worry about the backend services or processes.

## The Fun Stuff
[![Build Status](https://secure.travis-ci.org/MaddHacker/server-lite.svg?branch=master)](http://travis-ci.org/MaddHacker/server-lite)

[![Code Climate](https://codeclimate.com/github/MaddHacker/server-lite/badges/gpa.svg)](https://codeclimate.com/github/MaddHacker/server-lite)

[![Issue Count](https://codeclimate.com/github/MaddHacker/server-lite/badges/issue_count.svg)](https://codeclimate.com/github/MaddHacker/server-lite)

[![Test Coverage](https://codeclimate.com/github/MaddHacker/server-lite/badges/coverage.svg)](https://codeclimate.com/github/MaddHacker/server-lite/coverage)

[![Dependency Status](https://david-dm.org/MaddHacker/server-lite/status.svg)](https://david-dm.org/MaddHacker/server-lite)

[![npm Version](https://badge.fury.io/js/server-lite.svg)](https://badge.fury.io/js/server-lite)

## Why *Another* Web Server?
Most webservers that exist fall into 2 categories: *Not ready for production* or *Strongly opinionated*.  This implementation is meant to solve both of these concerns, creating a production-ready webserver that is weakly opinionated and highly configurable.

### Not ready for production
Surprisingly, several webserver projects seem to be super heavy, abandoned, or very limited implementations.  It's time for a webserver that is used, maintained and offers a real production solution.

### Strongly opinionated
There is nothing worse for developers than working with projects that won't let them tweak, tune or customize functionality.  These strong opinions make main-path programming simple, but fail when businesses move off main-path, as they inevitably do.

## Getting Started
- Install [the npm](https://www.npmjs.com/package/server-lite) in your project: `npm install --save server-lite`
- Require the library where needed: `const svr = require('server-lite');`
- Enjoy a robust server.

# Using `server-lite`
Utilizing `server-lite` should be simple and straightforward.  There are currently 5 different components that all work together to make webserver functionality rich and flexible.  Those are:
- `config` => designed to put all of the configuration in one object
- `content` => the lightweight, super-powered content manager.  This is aware of more than 680 different MIMETypes (and their file extensions), so you don't have to be.
- `handler` => pre-built request handling functionality to serve files and automatically concatenate your JavaScript or CSS files, without having to use an external lib.
- `server` => a one-call create (based on the `config`) and a one call start, the rest just works.
- `utils` => hooks to manage building response objects, loading files from the filesystem, and managing different types of web content.

Each of these are documented in further detail below, but a simple webserver can be setup as easily as:
```
const sl = require('server-lite');
const out = new (require('output-manager').Out()); // setup your output manager
function onReq(request, response) { out.i('recieved request'); } // create onRequest method
const cfg = new sl.config({ out: out, port: 8888, onRequest: onReq }); // assign config
const svr = new sl.server.http(cfg); // apply config
svr.start();
```

## `config`
The `config` object is all about configuration and single set of information.  The nice part about this is that it can be configured for `http` or `https`.  Each of the properties is set in the constructor, or can be accessed directly on the property at a later time.  The param list is:
- `out` => {output-manager}
- `httpsOptions` => {Hash} of options as defined [here](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener) or [here](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options)
- `port` => {number} port to start server listening on
- `host` => {string} optional host
- `backlog` => {number} optional backlog *do not set this if you don't understand it*
- `path` => {string} specifies a unix socket *do not set this if you don't understand it*
- `exclusive` => {boolean} deals with underlying file handle sharing *do not set this if you don't understand it*
- `onCheckContinue` => {Function} deals with status code 100 *do not set this if you don't understand it*
- `onCheckExpectation` => {Function} deals with checks not status code 100 *do not set this if you don't understand it*
- `onClientError` => {Function}  called when client has an error
- `onClose` => {Function}  called when server closes
- `onConnect` => {Function}  called on HTTP CONNECT
- `onConnection` => {Function}  called when a stream is established
- `onError` => {Function}  called on server error
- `onListening` => {Function}  called when server is listening on port
- `onRequest` => {Function}  primary request handler
- `onUpgrade` => {Function} called on HTTP upgrade requests *do not set this if you don't understand it*

For more information, it would be good to read the [Net#server.listen](https://nodejs.org/api/net.html#net_server_listen_options_callback) documentation, as well as the [HTTP](https://nodejs.org/api/http.html) and [HTTPS](https://nodejs.org/api/https.html) documentation on [nodejs.org](https://nodejs.org/api/index.html)

Declaring a new `config`:
```
const sl = require('server-lite');
const out = new (require('output-manager').Out()); 
function onReq(request, response) { out.i('recieved request'); }
const cfg = new sl.config({
    out: out,
    port: 8888,
    onRequest: onReq
});
```

## `content`
The `content` object is all about making sure MIMETypes and other header information is auto-magically calculated as needed.  `content` doesn't use a class, and instead exports the following methods:
- `binary` => meant to return a binary object type with MIMEType of `application/octet-stream`
- `text` => simple text handler to build a `text/plain` content object.  Used a lot for errors and other messages back to the client from the server.
- `byExtension` => simple method that looks up the MIMEType from the file extension, and uses the data to build a content object.
- `custom` => allows for a custom MIMEType to be assigned
- `mimeTypes` => a Hash of all known MIMETypes, and the associated extensions.

Likely most people will have minimal interaction with the `content` object.

Declaring `content`:
```
const sl = require('server-lite');
const out = new (require('output-manager').Out());
let simple = sl.content.text('Simple text');
out.i(JSON.stringify(simple)); // { type: 'text/plain; charset=utf-8', value: 'Simple text', length: 11 }
```

## `handler`
The `handler` object is meant to be the more opinionated solutions that you can optionally delegate to.  It relies heavily on the `utils` object, taking it as the first parameter of the constructor.  `handler` has 4 properties and 4 main methods, with over a dozen internals.  The properties are:
- `webRoot` => root of the webserver on the local filesystem.  You can see examples of this in the [tests](https://github.com/MaddHacker/server-lite/blob/master/__tests__/unit/sl-handler.unit.js#L57) or the [examples](#example-repositories)
- `indexPath` => path to the index file for requests to `/`
- `concatenateJavscriptFolderPath` => known folder where all `.js` files are eligible for concatenation
- `concatenateCssFolderPath` => known folder where all `.css` files are eligible for concatenation

In addition to these properties, you will find 4 main methods:
- `simpleFileBasedWebServer(request, response)` => Used to simply serve a file based on the request.  The request path is parsed to determin the filePath relative to the webRoot.
- `concatenatedJavscript(request, response)` => Used as sugar for `concatenateAll` => presumes the request is for concatenated `.js` files in given `concatenateJavscriptFolderPath`
- `concatenatedCss(request, response)` => Used as sugar for `concatenateAll` => presumes the request is for concatenated `.css` files in given `concatenateCssFolderPath`
- `concatenateAll(request, response, folder, ext)` => used to look at the request, and concatenate all matching files in `webRoot` + `folder` + `query name` + `ext (or extension)`

Create a simple file-based webserver:
```
const sl = require('server-lite');
const out = new (require('output-manager').Out()); // setup your output manager
const handler = new sl.handler();
function onReq(request, response) { handler.simpleFileBasedWebServer('recieved request'); } // create onRequest method
const cfg = new sl.config({ out: out, port: 8888, onRequest: onReq }); // assign config
const svr = new sl.server.http(cfg); // apply config
svr.start();
```

## `server`
The `server` object actually exposes 2 main consumer classes (`http` and `https`) and an internal reference to `slServer` for testing and special situations.  `http` and `https` do exactly what is expected, creating a server of that type, based on a given `config`.

An example of this:
```
const sl = require('server-lite');
const out = new (require('output-manager').Out()); // setup your output manager
function onReq(request, response) { out.i('recieved request'); } // create onRequest method
const cfg = new sl.config({ out: out, port: 8888, onRequest: onReq }); // assign config
const svr = new sl.server.http(cfg); // apply config
svr.start();
```

## `utils`
The `utils` object has several helpers that make management easier, but unlike `handler` are not meant to provide a complete solution.  `utils` takes an {output-manager} (optionally, if not provided it creates one) that can be used to write out.  There are several methods on `utils` as defined:
- `errStr` => builds an error message and logs the error (typically exceptions/errors caught)
- `buildFromFilePath` => returns a `content` object based on the `filePath` extension
- `loadDataFromFile` => uses promises to async load the data of the file at the given `filePath`
- `respondWithFileFromPath` => takes a {Http.Response} object and loads the given `filePath` data, and writes the reponse.
- `writeReponse` => given the {Http.Response} object and a content object, writes headers and content.

`utils` are easy to create, and very handy, especially if usage of `handler` is being considered.  This can all be done via:
```
const sl = require('server-lite');
const out = new (require('output-manager').Out()); // setup your output manager
const utilz = new sl.utils(out);
```

# Things to remember
- Everything is assumed to be `utf-8` or `utf8`

# Dependencies and Why
- [output-manager](https://www.npmjs.com/package/output-manager)

This is used to manage all output.  It comes with great string formatting from the [string-utilz](https://www.npmjs.com/package/string-utilz) package and date management from the [date-utilz](https://www.npmjs.com/package/date-utilz). This is a super-lightweight output-manager that helps to minimize disruptions in your code.  Because of the flexibility, you can easily direct logs to the console, files, or a stream.  Have a look at the [example libraries](https://github.com/MaddHacker/output-manager#example-repositories) for more information on how to do this.

- [promise](https://www.npmjs.com/package/promise)

As much as makes sense, `server-lite` works to use standard conventions for async processes, and the `promise` library helps to achieve that.

# Slack
This is one of several projects that are in the works, so feel free to reach out on [Slack](https://maddhacker.slack.com/).  Please email `slack at maddhacker dot com` for an invite.

# Issues
Please use the [Issues tab](../../issues) to report any problems or feature requests.

# Change Log
All change history can be found in the [CHANGELOG.md](CHANGELOG.md) file.

# Example Repositories
- [example-server-lite-webapp](https://github.com/MaddHacker/example-server-lite-webapp)

Using `server-lite` to build a static file webapp (could be SPA)...
