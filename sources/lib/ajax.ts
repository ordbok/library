/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

/* *
 *
 *  Types
 *
 * */

/**
 * Internal promise reject function
 */
type AjaxReject = (error?: IAjaxError) => void;

/**
 * Internal promise resolve function
 */
type AjaxResolve = (response?: IAjaxResponse) => void;

/* *
 *
 *  Interfaces
 *
 * */

/**
 * Error during an Ajax request
 */
export interface IAjaxError extends IAjaxResponse, Error {
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
export class Ajax {

    /* *
     *
     *  Constructors
     *
     * */

    /**
     * Creates a new managed AJAX instance.
     *
     * @param baseUrl
     *        Base URL of the server
     *
     * @param cacheTimeout
     *        Use 0 milliseconds to turn off all cache systems
     *
     * @param responseTimeout
     *        Time in milliseconds to wait for a server response
     */
    public constructor (
        baseUrl?: string, cacheTimeout?: number, responseTimeout?: number
    ) {

        this._cache = {};

        this.baseUrl = (baseUrl || '');
        this.cacheTimeout = (cacheTimeout || 3600000);
        this.responseTimeout = (responseTimeout || 60000);
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
     *  Functions
     *
     * */

    /**
     * Requests a server resource
     *
     * @param urlPath
     *        Base relative path to the requested server resource
     */
    public request (urlPath: string): Promise<IAjaxResponse> {

        return new Promise((resolve: AjaxResolve, reject: AjaxReject) => {

            const url = this.baseUrl + urlPath;

            if (this.cacheTimeout > 0) {

                const cachedResult = this._cache[url];
                const cacheTimeout = (new Date()).getTime() + this.cacheTimeout;

                if (cachedResult &&
                    cachedResult.timestamp > cacheTimeout
                ) {
                    resolve(cachedResult);
                    return;
                }

                delete this._cache[url];
            }

            const server = new XMLHttpRequest();

            try {

                if (this.cacheTimeout === 0 && url.indexOf('?') === -1) {
                    server.open(
                        'GET',
                        (url + '?' + (new Date()).getTime()),
                        true
                    );
                }
                else {
                    server.open('GET', url, true);
                }

                server.timeout = this.responseTimeout;

                server.addEventListener('load', (evt) => resolve({
                    result: (server.response || '').toString(),
                    serverStatus: server.status,
                    timestamp: evt.timeStamp,
                    url: url
                }));

                server.addEventListener('error', (evt) => {

                    const error = new Error('error') as IAjaxError;

                    error.result = server.response.toString();
                    error.serverStatus = server.status;
                    error.timestamp = evt.timeStamp;
                    error.url = url;

                    reject(error);
                });

                server.addEventListener('timeout', (evt) => {

                    const error = new Error('timeout') as IAjaxError;

                    error.result = server.response.toString();
                    error.serverStatus = server.status;
                    error.timestamp = evt.timeStamp;
                    error.url = url;

                    reject(error)
                });

                server.send();
            }
            catch (catchedError) {

                const error = catchedError as IAjaxError;

                error.result = (server.response || '');
                error.timestamp = (new Date()).getTime();
                error.serverStatus = server.status;
                error.url = url;

                reject(error);
            }
        });
    }
}
