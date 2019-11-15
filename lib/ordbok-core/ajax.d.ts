/**
 * Error during an Ajax request
 */
export interface IAjaxError extends Error, IAjaxResponse {
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
/**
 * Manages AJAX communication with a server.
 */
export declare class Ajax {
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
    constructor(baseUrl?: string, cacheTimeout?: number, responseTimeout?: number);
    /**
     * Cached results
     */
    private _cache;
    /**
     * Counter of open requests
     */
    private _requests;
    /**
     * Base URL of the server
     */
    baseUrl: string;
    /**
     * Set to 0 to turn off all cache systems
     */
    cacheTimeout: number;
    /**
     * Time in milliseconds to wait for a server response
     */
    responseTimeout: number;
    /**
     * Handles server error.
     *
     * @param this
     *        Extended XMLHTTPRequest.
     *
     * @param progressEvent
     *        XMLHTTPRequest event.
     */
    private onError;
    /**
     * Handles server data.
     *
     * @param this
     *        Extended XMLHTTPRequest.
     *
     * @param progressEvent
     *        XMLHTTPRequest event.
     */
    private onLoad;
    /**
     * Handles server timeout.
     *
     * @param this
     *        Extended XMLHTTPRequest.
     *
     * @param progressEvent
     *        XMLHTTPRequest event.
     */
    private onTimeout;
    /**
     * Checks for open requests.
     */
    hasOpenRequest(): boolean;
    /**
     * Requests a server resource.
     *
     * @param urlPath
     *        Base relative path to the requested server resource.
     */
    request(urlPath: string): Promise<IAjaxResponse>;
}
