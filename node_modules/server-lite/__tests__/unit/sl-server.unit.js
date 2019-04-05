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

const svr = require('../../lib/sl-server');
const cfg = require('../../lib/sl-config');

class MockSvr {
    constructor() {
        this.actions = {};
        this.listenOpts = null;
        this.listenFxn = null;
        this.closeCalled = false;
    }

    on(action, fxn) {
        this.actions[action] = fxn;
        return this;
    }
    listen(opts, fxn) {
        this.listenOpts = opts;
        this.listenFxn = fxn;
        return this;
    }
    close() {
        this.closeCalled = true;
    }
}

describe('sl-server (Unit)', () => {
    describe('Check slServer', () => {
        let tmpSvr = new svr.slServer();
        it('should use default slConfig', () => {
            expect(tmpSvr._config).not.toBeNull();
            expect(tmpSvr._config.listenOptions.port).toBe(5000);
        });
        it('should have the server object set to null', () => {
            expect(tmpSvr.server).toBeNull();
        });

        let mySvr = new MockSvr();
        it('should have a MockSvr', () => {
            expect(JSON.stringify(mySvr.actions)).toBe(JSON.stringify({}));
            expect(mySvr.listenOpts).toBeNull();
            expect(mySvr.listenFxn).toBeNull();
            expect(mySvr.closeCalled).toBe(false);
        });

        it('should set server object when started', () => {
            tmpSvr._start(mySvr);
            expect(tmpSvr.server).not.toBeNull();
            expect(tmpSvr.server instanceof MockSvr).toBe(true);
        });
        it('should not set closeCalled', () => {
            expect(mySvr.closeCalled).toBe(false);
        });
        it('should setup all mock actions (and they should be Functions)', () => {
            expect(mySvr.actions.checkContinue).not.toBeNull();
            expect(mySvr.actions.checkContinue instanceof Function).toBe(true);
            expect(mySvr.actions.checkExpectation).not.toBeNull();
            expect(mySvr.actions.checkExpectation instanceof Function).toBe(true);
            expect(mySvr.actions.clientError).not.toBeNull();
            expect(mySvr.actions.clientError instanceof Function).toBe(true);
            expect(mySvr.actions.close).not.toBeNull();
            expect(mySvr.actions.close instanceof Function).toBe(true);
            expect(mySvr.actions.connect).not.toBeNull();
            expect(mySvr.actions.connect instanceof Function).toBe(true);
            expect(mySvr.actions.connection).not.toBeNull();
            expect(mySvr.actions.connection instanceof Function).toBe(true);
            expect(mySvr.actions.error).not.toBeNull();
            expect(mySvr.actions.error instanceof Function).toBe(true);
            expect(mySvr.actions.upgrade).not.toBeNull();
            expect(mySvr.actions.upgrade instanceof Function).toBe(true);
        });
        it('should have set the listenFxn (and it should be a Function)', () => {
            expect(mySvr.listenFxn).not.toBeNull();
            expect(mySvr.listenFxn instanceof Function).toBe(true);
        });
        it('should have set the listenOpts', () => {
            expect(mySvr.listenOpts).not.toBeNull();
        });
        it('should be using port 5000', () => {
            expect(mySvr.listenOpts.port).toBe(5000);
        });
        it('should set closeCalled when close is called', () => {
            tmpSvr.stop();
            expect(mySvr.closeCalled).toBe(true);
        });
    });
    describe('Check slHttpServer', () => {
        it('should be an instanceof slServer', () => {
            expect((new svr.http()) instanceof svr.slServer).toBe(true);
        });
        it('should use default slConfig', () => {
            let tmpSvr = new svr.http();
            expect(tmpSvr._config).not.toBeNull();
            expect(tmpSvr._config.listenOptions.port).toBe(5000);
            expect(tmpSvr.server).toBeNull();
        });
        it('should use given slConfig', () => {
            let tmpSvr = new svr.http(new cfg({ port: 1234 }));
            expect(tmpSvr._config).not.toBeNull();
            expect(tmpSvr._config.listenOptions.port).toBe(1234);
        });
    });
    describe('Check slHttpsServer', () => {
        it('should be an instanceof slServer', () => {
            expect((new svr.https()) instanceof svr.slServer).toBe(true);
        });
        it('should use default slConfig', () => {
            let tmpSvr = new svr.https();
            expect(tmpSvr._config).not.toBeNull();
            expect(tmpSvr._config.listenOptions.port).toBe(5000);
            expect(tmpSvr.server).toBeNull();
        });
        it('should use given slConfig', () => {
            let tmpSvr = new svr.https(new cfg({ port: 1234 }));
            expect(tmpSvr._config).not.toBeNull();
            expect(tmpSvr._config.listenOptions.port).toBe(1234);
        });
    });
});
