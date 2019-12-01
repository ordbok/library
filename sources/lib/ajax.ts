/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

/* *
 *
 *  Interfaces
 *
 * */

/**
 * Internal request context
 */
interface IAjaxContext {
    ajax: AJAX;
    isCountingRequest?: boolean;
    url: string;
    resolve(response: IAjaxResponse): void;
    reject(error: IAjaxError): void;
}

/**
 * Error during an Ajax request
 */
export interface IAjaxError extends Error, IAjaxResponse {
}

/**
 * Internal request instance
 */
interface IAjaxRequest extends XMLHttpRequest {
    context?: IAjaxContext;
}

/**
 * Response to an AJAX request
 */
export interface IAjaxResponse {

    /**
     * Result body send by the server
     */
    result: string;

    /**
     * HTTP status code send by the server
     */
    serverStatus: number;

    /**
     * Timestamp for the response event
     */
    timestamp: number;

    /**
     * URL of the server request
     */
    url: string;
}

/* *
 *
 *  Classes
 *
 * */

/**
 * Manages AJAX communication with a server.
 */
export class AJAX {

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
    public constructor (
        baseUrl: string = '',
        cacheTimeout: number = 3600000,
        responseTimeout: number = 60000
    ) {

        this._cache = {};
        this._requests = 0;

        this.baseUrl = baseUrl;
        this.cacheTimeout = (cacheTimeout < 0 ? 0 : cacheTimeout);
        this.responseTimeout = (responseTimeout < 0 ? 0 : responseTimeout);
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Cached results
     */
    private _cache: { [key: string]: IAjaxResponse };

    /**
     * Counter of open requests
     */
    private _requests: number;

    /**
     * Base URL of the server
     */
    public baseUrl: string;

    /**
     * Set to 0 to turn off all cache systems
     */
    public cacheTimeout: number;

    /**
     * Time in milliseconds to wait for a server response
     */
    public responseTimeout: number;

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
    private onError (this: IAjaxRequest, progressEvent: ProgressEvent): void {

        const context = this.context;

        if (!context) {
            return;
        }

        const error = new Error('error') as IAjaxError;

        error.result = this.response.toString();
        error.serverStatus = this.status;
        error.timestamp = progressEvent.timeStamp;
        error.url = context.url;

        if (context.isCountingRequest) {
            context.isCountingRequest = false;
            context.ajax._requests--;
        }

        context.reject(error);
    }

    /**
     * Handles server data.
     *
     * @param this
     *        Extended XMLHTTPRequest.
     *
     * @param progressEvent
     *        XMLHTTPRequest event.
     */
    private onLoad (this: IAjaxRequest, progressEvent: ProgressEvent): void {

        const context = this.context;

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
        })
    }

    /**
     * Handles server timeout.
     *
     * @param this
     *        Extended XMLHTTPRequest.
     *
     * @param progressEvent
     *        XMLHTTPRequest event.
     */
    private onTimeout (this: IAjaxRequest, progressEvent: ProgressEvent): void {

        const context = this.context;

        if (!context) {
            return;
        }

        const error = new Error('timeout') as IAjaxError;

        error.result = this.response.toString();
        error.serverStatus = this.status;
        error.timestamp = progressEvent.timeStamp;
        error.url = context.url;

        if (context.isCountingRequest) {
            context.isCountingRequest = false;
            context.ajax._requests--;
        }

        context.reject(error);
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Checks for open requests.
     */
    public hasOpenRequest (): boolean {

        if (this._requests < 0) {
            this._requests = 0;
        }

        return (this._requests > 0);
    }

    /**
     * Requests a server resource.
     *
     * @param urlPath
     *        Base relative path to the requested server resource.
     */
    public request (urlPath: string): Promise<IAjaxResponse> {

        const ajax = this;

        return new Promise(function (
            resolve: IAjaxContext['resolve'],
            reject: IAjaxContext['reject']
        ): void {

            const url: string = ajax.baseUrl + urlPath;
            const context: IAjaxContext = { ajax, resolve, reject, url };

            if (ajax.cacheTimeout > 0) {

                const cachedResult: IAjaxResponse = ajax._cache[url];
                const cacheTimeout: number = (new Date()).getTime() + ajax.cacheTimeout;

                if (
                    cachedResult &&
                    cachedResult.timestamp > cacheTimeout
                ) {
                    resolve(cachedResult);
                    return;
                }

                delete ajax._cache[url];
            }

            const server: IAjaxRequest = new XMLHttpRequest();

            server.context = context;
            context.isCountingRequest = false;

            try {

                if (
                    ajax.cacheTimeout <= 0 &&
                    url.indexOf('?') === -1
                ) {
                    server.open(
                        'GET',
                        (url + '?' + (new Date()).getTime()),
                        true
                    );
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

                const error = catchedError as IAjaxError;

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
    }
}

export default AJAX;
