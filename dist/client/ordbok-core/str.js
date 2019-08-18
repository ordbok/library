/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* *
     *
     *  Constants
     *
     * */
    /**
     * Inclusive brackets pattern
     */
    var BRACKET_REGEXP = /\([^\)]*\)|\[[^\]]*\]|\{[^\}]*\}/g;
    /**
     * Inclusive space pattern
     */
    var SPACE_REGEXP = /\s+/g;
    /* *
     *
     *  Classes
     *
     * */
    /**
     * String utility class.
     */
    var Str = /** @class */ (function (_super) {
        __extends(Str, _super);
        /* *
         *
         *  Constructors
         *
         * */
        function Str(str) {
            return _super.call(this, str) || this;
        }
        /* *
         *
         *  Static Functions
         *
         * */
        /**
         * Tests for a matching pattern at the string end.
         *
         * @param str
         *        String to test.
         *
         * @param pattern
         *        Pattern to match.
         */
        Str.endsWith = function (str, pattern) {
            if (str === pattern) {
                return true;
            }
            var strLength = str.length;
            var patternLength = pattern.length;
            return (patternLength <= strLength &&
                str.lastIndexOf(pattern) === strLength - patternLength);
        };
        /**
         * Removes brackets and their content.
         *
         * @param str
         *        String to filter.
         */
        Str.removeBrackets = function (str) {
            return str.replace(BRACKET_REGEXP, '').replace(SPACE_REGEXP, ' ').trim();
        };
        /**
         * Trims all unnecessary spaces.
         *
         * @param str
         *        String to filter.
         */
        Str.trimSpaces = function (str) {
            return str.replace(SPACE_REGEXP, ' ').trim();
        };
        /* *
         *
         *  Functions
         *
         * */
        /**
         * Tests for a matching pattern at the string end.
         *
         * @param pattern
         *        Pattern to match.
         */
        Str.prototype.endsWith = function (pattern) {
            return Str.endsWith(this.toString(), pattern);
        };
        /**
         * Removes brackets and their content.
         */
        Str.prototype.removeBrackets = function () {
            return new Str(Str.removeBrackets(this.toString()));
        };
        /**
         * Trims all unnecessary spaces.
         */
        Str.prototype.trimSpaces = function () {
            return new Str(Str.trimSpaces(this.toString()));
        };
        return Str;
    }(String));
    exports.Str = Str;
});
//# sourceMappingURL=str.js.map