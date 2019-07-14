/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

import { Text } from './text';

/* *
 *
 *  Interfaces
 *
 * */

/**
 * Page with headline separated sections
 */
export interface IMarkdownPage {
    [headline: string]: IMarkdownSection;
}

/**
 * Sections after a page headline
 */
export interface IMarkdownSection {
    [key: string]: Array<string>;
}

/* *
 *
 *  Constants
 *
 * */

/**
 * Section headline
 */
const HEADLINE_REGEXP = /^(?:#+([\s\S]*)|([\s\S]*?)\n(?:={3,}|-{3,}))$/;

/**
 * Key value pair
 */
const PAIR_REGEXP = /^([^\:\n\r\t\v]+):([\s\S]*)$/;

/**
 * Page separator
 */
const PAGE_REGEXP = /(?:^\n?|\n\n)-{3,}(?:\n\n|\n?$)/;

/**
 * Paragraph separator
 */
const PARAGRAPH_REGEXP = /\n{2,}/;

/* *
 *
 *  Classes
 *
 * */

/**
 * Markdown parser
 */
export class Markdown {

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
    private static parsePage (markdownPage: string): IMarkdownPage {

        const page = {} as IMarkdownPage;

        let match: (RegExpExecArray|null);
        let section: (IMarkdownSection|undefined);

        markdownPage
            .split(PARAGRAPH_REGEXP)
            .forEach(paragraph => {

                match = HEADLINE_REGEXP.exec(paragraph);

                if (match) {
                    page[Text.trimSpaces(match[1] || match[2])] = section = {};
                }

                if (!section) {
                    return;
                }

                match = PAIR_REGEXP.exec(paragraph);

                if (match) {
                    section[match[1]] = match[2]
                        .split(';')
                        .map(Text.trimSpaces);
                }
            })

        return page;
    }

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
    public constructor (markdown: string) {

        this._pages = [];
        this._raw = markdown;

        this.parse(markdown);
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Internal markdown pages
     */
    private _pages: Array<IMarkdownPage>;

    /**
     * Internal raw markdown
     */
    private _raw: string;

    /**
     * Markdown pages
     */
    public get pages(): Array<IMarkdownPage> {
        return this._pages;
    }

    /**
     * Raw markdown
     */
    public get raw(): string {
        return this._raw;
    }

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
    private parse (markdown: string) {

        const pages = this._pages;

        markdown
            .split(PAGE_REGEXP)
            .forEach(page => pages.push(Markdown.parsePage(page)));
    }
}
