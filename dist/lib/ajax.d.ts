/**
 * @license MIT
 * @author Sophie Bremer
 */
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
/**
 * Manages AJAX communication with a server.
 */
export declare class Ajax {
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
    constructor(baseUrl?: string, cacheTimeout?: number, responseTimeout?: number);
    /**
     * Cached results
     */
    private _cache;
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
     * Requests a server resource
     *
     * @param urlPath
     *        Base relative path to the requested server resource
     */
    request(urlPath: string): Promise<IAjaxResponse>;
}
