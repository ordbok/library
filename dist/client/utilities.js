/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* *
     *
     *  Constants
     *
     * */
    /**
     * Non-character pattern
     */
    var NON_CHARACTER_REGEXP = /[^0-9A-Za-z\u0080-\uFFFF- ]/g;
    /**
     * Path pattern
     */
    var PATH_REGEXP = /^(.*?)([^\.\/]*)([^\/]*)$/;
    /**
     * Space pattern
     */
    var SPACE_REGEXP = /\s+/g;
    /* *
     *
     *  Modules
     *
     * */
    var Utilities;
    (function (Utilities) {
        /**
         * Returns the extension of a file path.
         *
         * @param filePath
         *        File path
         */
        function getExtension(filePath) {
            var match = PATH_REGEXP.exec(filePath);
            return (match && match[3] || '');
        }
        Utilities.getExtension = getExtension;
        /**
         * Returns the base name of a file path.
         *
         * @param filePath
         *        File path
         */
        function getBaseName(filePath) {
            var match = PATH_REGEXP.exec(filePath);
            return (match && match[2] || '');
        }
        Utilities.getBaseName = getBaseName;
        /**
         * Returns the universal key for the given text.
         *
         * @param text
         *        Text to generate key from
         */
        function getKey(text) {
            return text
                .replace(NON_CHARACTER_REGEXP, ' ')
                .trim()
                .replace(SPACE_REGEXP, '-')
                .toLowerCase();
        }
        Utilities.getKey = getKey;
        /**
         * Normalize a text to lower case characters and space only.
         *
         * @param text
         *        Text to filter
         */
        function getNorm(text) {
            return text
                .replace(NON_CHARACTER_REGEXP, ' ')
                .trim()
                .replace(SPACE_REGEXP, ' ')
                .toLowerCase();
        }
        Utilities.getNorm = getNorm;
        /**
         * Returns the parent part of the path.
         *
         * @param path
         *        Path with parent
         */
        function getParentPath(path) {
            var match = PATH_REGEXP.exec(path);
            return (match && match[1] || '');
        }
        Utilities.getParentPath = getParentPath;
        /**
         * Rotates characters in a text.
         *
         * @param text
         *        Text to rotate
         */
        function rotate(text) {
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
        Utilities.rotate = rotate;
    })(Utilities = exports.Utilities || (exports.Utilities = {}));
});
//# sourceMappingURL=utilities.js.map