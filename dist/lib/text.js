"use strict";
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
 * Text utility class.
 */
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    /* *
     *
     *  Constructors
     *
     * */
    function Text(text) {
        return _super.call(this, text) || this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Tests for a matching pattern at the text end.
     *
     * @param text
     *        Text to test.
     *
     * @param pattern
     *        Pattern to match.
     */
    Text.endsWith = function (text, pattern) {
        if (text === pattern) {
            return true;
        }
        var textLength = text.length;
        var patternLength = pattern.length;
        return (patternLength <= textLength &&
            text.lastIndexOf(pattern) === textLength - patternLength);
    };
    /**
     * Removes brackets and their content.
     *
     * @param text
     *        Text to filter.
     */
    Text.removeBrackets = function (text) {
        return text.replace(BRACKET_REGEXP, '').replace(SPACE_REGEXP, ' ').trim();
    };
    /**
     * Trims all unnecessary spaces.
     *
     * @param text
     *        Text to filter.
     */
    Text.trimSpaces = function (text) {
        return text.replace(SPACE_REGEXP, ' ').trim();
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Tests for a matching pattern at the text end.
     *
     * @param pattern
     *        Pattern to match.
     */
    Text.prototype.endsWith = function (pattern) {
        return Text.endsWith(this.toString(), pattern);
    };
    /**
     * Removes brackets and their content.
     */
    Text.prototype.removeBrackets = function () {
        return new Text(Text.removeBrackets(this.toString()));
    };
    /**
     * Trims all unnecessary spaces.
     */
    Text.prototype.trimSpaces = function () {
        return new Text(Text.trimSpaces(this.toString()));
    };
    return Text;
}(String));
exports.Text = Text;
