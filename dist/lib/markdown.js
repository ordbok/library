"use strict";
/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var text_1 = require("./text");
/* *
 *
 *  Constants
 *
 * */
/**
 * Section headline
 */
var HEADLINE_REGEXP = /^(?:#+([\s\S]*)|([\s\S]*?)\n(?:={3,}|-{3,}))$/;
/**
 * Key value pair
 */
var PAIR_REGEXP = /^([^\:\n\r\t\v]+):([\s\S]*)$/;
/**
 * Page separator
 */
var PAGE_REGEXP = /(?:^\n?|\n\n)-{3,}(?:\n\n|\n?$)/;
/**
 * Paragraph separator
 */
var PARAGRAPH_REGEXP = /\n{2,}/;
/* *
 *
 *  Classes
 *
 * */
/**
 * Markdown parser
 */
var Markdown = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    /**
     * Parse markdown.
     *
     * @param markdown
     *        Markdown to parse
     */
    function Markdown(markdown) {
        this._pages = [];
        this._raw = markdown;
        this.parse(markdown);
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Internal markdown page parser
     *
     * @param markdownPage
     *        Markdown page
     */
    Markdown.parsePage = function (markdownPage) {
        var page = {};
        var match;
        var section;
        markdownPage
            .split(PARAGRAPH_REGEXP)
            .forEach(function (paragraph) {
            match = HEADLINE_REGEXP.exec(paragraph);
            if (match) {
                page[text_1.Text.trimSpaces(match[1] || match[2])] = section = {};
            }
            if (!section) {
                return;
            }
            match = PAIR_REGEXP.exec(paragraph);
            if (match) {
                section[match[1]] = match[2]
                    .split(',')
                    .map(text_1.Text.trimSpaces);
            }
        });
        return page;
    };
    Object.defineProperty(Markdown.prototype, "pages", {
        /**
         * Markdown pages
         */
        get: function () {
            return this._pages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Markdown.prototype, "raw", {
        /**
         * Raw markdown
         */
        get: function () {
            return this._raw;
        },
        enumerable: true,
        configurable: true
    });
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Internal markdown parser
     *
     * @param markdown
     *        Markdown to parse
     */
    Markdown.prototype.parse = function (markdown) {
        var pages = this._pages;
        markdown
            .split(PAGE_REGEXP)
            .forEach(function (page) { return pages.push(Markdown.parsePage(page)); });
    };
    return Markdown;
}());
exports.Markdown = Markdown;
