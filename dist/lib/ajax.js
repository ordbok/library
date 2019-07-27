"use strict";
/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
/* *
 *
 *  Classes
 *
 * */
/**
 * Manages AJAX communication with a server.
 */
var Ajax = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    /**
     * Creates a new managed AJAX instance.
     *
     * @param baseUrl
     *        Base URL of the server.
     *
     * @param cacheTimeout
     *        Use 0 milliseconds to turn off all cache systems. Default is 1
     *        hour.
     *
     * @param responseTimeout
     *        Time in milliseconds to wait for a server response. Default are 60
     *        seconds.
     */
    function Ajax(baseUrl, cacheTimeout, responseTimeout) {
        if (baseUrl === void 0) { baseUrl = ''; }
        if (cacheTimeout === void 0) { cacheTimeout = 3600000; }
        if (responseTimeout === void 0) { responseTimeout = 60000; }
        this._cache = {};
        this._requests = 0;
        this.baseUrl = baseUrl;
        this.cacheTimeout = (cacheTimeout < 0 ? 0 : cacheTimeout);
        this.responseTimeout = (responseTimeout < 0 ? 0 : responseTimeout);
    }
    /* *
     *
     *  Events
     *
     * */
    /**
     * Handles server error.
     *
     * @param this
     *        Extended XMLHTTPRequest.
     *
     * @param progressEvent
     *        XMLHTTPRequest event.
     */
    Ajax.prototype.onError = function (progressEvent) {
        var context = this.context;
        if (!context) {
            return;
        }
        var error = new Error('error');
        error.result = this.response.toString();
        error.serverStatus = this.status;
        error.timestamp = progressEvent.timeStamp;
        error.url = context.url;
        if (context.isCountingRequest) {
            context.isCountingRequest = false;
            context.ajax._requests--;
        }
        context.reject(error);
    };
    /**
     * Handles server data.
     *
     * @param this
     *        Extended XMLHTTPRequest.
     *
     * @param progressEvent
     *        XMLHTTPRequest event.
     */
    Ajax.prototype.onLoad = function (progressEvent) {
        var context = this.context;
        if (!context) {
            return;
        }
        if (context.isCountingRequest) {
            context.isCountingRequest = false;
            context.ajax._requests--;
        }
        context.resolve({
            result: (this.response || '').toString(),
            serverStatus: this.status,
            timestamp: progressEvent.timeStamp,
            url: context.url
        });
    };
    /**
     * Handles server timeout.
     *
     * @param this
     *        Extended XMLHTTPRequest.
     *
     * @param progressEvent
     *        XMLHTTPRequest event.
     */
    Ajax.prototype.onTimeout = function (progressEvent) {
        var context = this.context;
        if (!context) {
            return;
        }
        var error = new Error('timeout');
        error.result = this.response.toString();
        error.serverStatus = this.status;
        error.timestamp = progressEvent.timeStamp;
        error.url = context.url;
        if (context.isCountingRequest) {
            context.isCountingRequest = false;
            context.ajax._requests--;
        }
        context.reject(error);
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Checks for open requests.
     */
    Ajax.prototype.hasOpenRequest = function () {
        if (this._requests < 0) {
            this._requests = 0;
        }
        return (this._requests > 0);
    };
    /**
     * Requests a server resource.
     *
     * @param urlPath
     *        Base relative path to the requested server resource.
     */
    Ajax.prototype.request = function (urlPath) {
        var ajax = this;
        return new Promise(function (resolve, reject) {
            var url = ajax.baseUrl + urlPath;
            var context = { ajax: ajax, resolve: resolve, reject: reject, url: url };
            if (ajax.cacheTimeout > 0) {
                var cachedResult = ajax._cache[url];
                var cacheTimeout = (new Date()).getTime() + ajax.cacheTimeout;
                if (cachedResult &&
                    cachedResult.timestamp > cacheTimeout) {
                    resolve(cachedResult);
                    return;
                }
                delete ajax._cache[url];
            }
            var server = new XMLHttpRequest();
            server.context = context;
            context.isCountingRequest = false;
            try {
                if (ajax.cacheTimeout <= 0 &&
                    url.indexOf('?') === -1) {
                    server.open('GET', (url + '?' + (new Date()).getTime()), true);
                }
                else {
                    server.open('GET', url, true);
                }
                ajax._requests++;
                context.isCountingRequest = true;
                server.timeout = ajax.responseTimeout;
                server.addEventListener('load', ajax.onLoad);
                server.addEventListener('error', ajax.onError);
                server.addEventListener('timeout', ajax.onTimeout);
                server.send();
            }
            catch (catchedError) {
                var error = catchedError;
                error.result = (server.response || '');
                error.timestamp = (new Date()).getTime();
                error.serverStatus = server.status;
                error.url = context.url;
                if (context.isCountingRequest) {
                    context.isCountingRequest = false;
                    context.ajax._requests--;
                }
                reject(error);
            }
        });
    };
    return Ajax;
}());
exports.Ajax = Ajax;
