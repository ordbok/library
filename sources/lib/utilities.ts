/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

/* *
 *
 *  Constants
 *
 * */

/**
 * Non-character pattern
 */
const NON_CHARACTER_REGEXP = /[^0-9A-Za-z\u0080-\uFFFF -]/g;

/**
 * Path pattern
 */
const PATH_REGEXP = /^(.*?)([^\.\/]*)([^\/]*)$/;

/**
 * Space pattern
 */
const SPACE_REGEXP = /\s+/g;

/* *
 *
 *  Modules
 *
 * */

export module Utilities
{
    /* *
     *
     *  Functions
     *
     * */

    /**
     * Returns the extension of a file path.
     *
     * @param filePath
     *        File path
     */
    export function getExtension (filePath: string): string
    {
        let match = PATH_REGEXP.exec(filePath);

        return (match && match[3] || '');
    }

    /**
     * Returns the base name of a file path.
     *
     * @param filePath
     *        File path
     */
    export function getBaseName (filePath: string): string
    {
        let match = PATH_REGEXP.exec(filePath);

        return (match && match[2] || '');
    }

    /**
     * Returns the universal key for the given text.
     *
     * @param text
     *        Text to generate key from
     */
    export function getKey (text: string): string
    {
        return text
            .replace(NON_CHARACTER_REGEXP, ' ')
            .trim()
            .replace(SPACE_REGEXP, '-')
            .toLowerCase();
    }

    /**
     * Normalize a text to lower case characters and space only.
     *
     * @param text
     *        Text to filter
     */
    export function getNorm (text: string): string
    {
        return text
            .replace(NON_CHARACTER_REGEXP, ' ')
            .trim()
            .replace(SPACE_REGEXP, ' ')
            .toLowerCase();
    }

    /**
     * Returns the parent part of the path.
     *
     * @param path
     *        Path with parent
     */
    export function getParentPath (path: string): string
    {
        let match = PATH_REGEXP.exec(path);

        return (match && match[1] || '');
    }

    /**
     * Binary rotation of a given text.
     *
     * @param text
     *        Text to rotate
     */
    export function rotate (text: string): string
    {
        const isDecode = text.indexOf('base64,') === 0;

        if (isDecode)
        {
            text = atob(text.substr(7));
        }

        const result = [];

        for (let charCode = 0, index = 0, indexEnd = text.length; index < indexEnd; ++index)
        {
            charCode = text.charCodeAt(index);
            charCode += (charCode < 128 ? 128 : -128);
            result.push(String.fromCharCode(charCode));
        }

        text = result.join('');

        if (!isDecode) {
            text = 'base64,' + btoa(text);
        }

        return text;
    }

    /**
     * Simplifies nested arrays and object properties to a single array of
     * values.
     *
     * @param obj
     *        Object to reduce
     */
    export function splat<T> (obj: object): Array<T>
    {
        if (obj instanceof Array)
        {
            return obj
                .reduce(
                    function (result: Array<T>, value: any): Array<T>
                    {
                        if (value && typeof value === 'object')
                        {
                            result.push(...splat<T>(value));
                        }
                        else
                        {
                            result.push(value);
                        }

                        return result;
                    },
                    [] as Array<T>
                );
        }
        else
        {
            return splat<T>(Object.values(obj));
        }
    }
}
