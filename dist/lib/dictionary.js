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
var ajax_1 = require("./ajax");
var utilities_1 = require("./utilities");
/* *
 *
 *  Classes
 *
 * */
var Dictionary = /** @class */ (function (_super) {
    __extends(Dictionary, _super);
    function Dictionary() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Converts a text into a dictionary entry.
     *
     * @param stringified
     *        Dictionary text
     */
    Dictionary.parse = function (stringified) {
        var dictionaryPage = {};
        var categorySplit;
        var dictionarySection;
        stringified
            .split('\n')
            .forEach(function (line) {
            if (line.indexOf(':') === -1) {
                dictionaryPage[line] = dictionarySection = {};
                return;
            }
            if (!dictionarySection) {
                return;
            }
            categorySplit = line.split(':', 2);
            dictionarySection[categorySplit[0]] = categorySplit[1].split(';');
        });
        return dictionaryPage;
    };
    /**
     * Converts a Markdown page into a dictionary text.
     *
     * @param markdownPage
     *        Markdown page
     */
    Dictionary.stringify = function (markdownPage) {
        var stringified = [];
        var markdownSection;
        Object
            .keys(markdownPage)
            .forEach(function (headline) {
            stringified.push(utilities_1.Utilities.getKey(headline));
            markdownSection = markdownPage[headline];
            Object
                .keys(markdownSection)
                .forEach(function (category) {
                return stringified.push(utilities_1.Utilities.getKey(category) + ':' + markdownSection[category].join(';'));
            });
        });
        return stringified.join('\n');
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Loads a dictionary entry from the server.
     *
     * @param baseName
     *        Base name of the translation file
     */
    Dictionary.prototype.loadEntry = function (baseName) {
        var _this = this;
        return new Promise(function (resolve) {
            _this
                .request(utilities_1.Utilities.getKey(baseName) + '.txt')
                .then(function (response) {
                if (response instanceof Error ||
                    response.serverStatus >= 400) {
                    return undefined;
                }
                return Dictionary.parse(response.result);
            })
                .catch(function (error) {
                console.error(error);
                return undefined;
            })
                .then(resolve);
        });
    };
    return Dictionary;
}(ajax_1.Ajax));
exports.Dictionary = Dictionary;
