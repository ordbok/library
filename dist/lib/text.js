"use strict";
/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
/* *
 *
 *  Constants
 *
 * */
/**
 * Inclusive space pattern
 */
var SPACE_REGEXP = /\s+/g;
/* *
 *
 *  Classes
 *
 * */
var Text = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function Text(text) {
        this._value = text;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    Text.endsWith = function (text, pattern) {
        if (text === pattern) {
            return true;
        }
        var textLength = text.length;
        var patternLength = pattern.length;
        return (patternLength <= textLength &&
            text.lastIndexOf(pattern) === textLength - patternLength);
    };
    Text.trimSpaces = function (text) {
        return text.replace(SPACE_REGEXP, ' ').trim();
    };
    /* *
     *
     *  Functions
     *
     * */
    Text.prototype.endsWith = function (pattern) {
        return Text.endsWith(this._value, pattern);
    };
    Text.prototype.trimSpaces = function () {
        return new Text(Text.trimSpaces(this._value));
    };
    return Text;
}());
exports.Text = Text;
