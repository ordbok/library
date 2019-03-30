/**
 * @license MIT
 * @author Sophie Bremer
 */

/* *
 *
 *  Constants
 *
 * */

/**
 * Non-character pattern
 */
const NON_CHARACTER_REGEXP = /[^0-9A-Za-z\u0080-\uFFFF- ]/g;

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

export module Utilities {

    /**
     * Returns the extension of a file path.
     *
     * @param filePath
     *        File path
     */
    export function getExtension (filePath: string): string {

        let match = PATH_REGEXP.exec(filePath);

        return (match && match[3] || '');
    }

    /**
     * Returns the base name of a file path.
     *
     * @param filePath
     *        File path
     */
    export function getBaseName (filePath: string): string {

        let match = PATH_REGEXP.exec(filePath);

        return (match && match[2] || '');
    }

    /**
     * Returns the universal key for the given text.
     *
     * @param text
     *        Text to generate key from
     */
    export function getKey (text: string): string {

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
    export function getNorm (text: string): string {

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
    export function getParentPath (path: string): string {

        let match = PATH_REGEXP.exec(path);

        return (match && match[1] || '');
    }

    /**
     * Rotates characters in a text.
     *
     * @param text
     *        Text to rotate
     */
    export function rotate (text: string): string {

        var result = [];

        for (var c = 0, i = 0, ie = text.length; i < ie; ++i) {

            c = text.charCodeAt(i);

            if (c > 31 && c < 128) {
                c += (c < 80 ? 48 : -48);
            }

            result.push(String.fromCharCode(c));
        }

        return result.join('');
    }
}
