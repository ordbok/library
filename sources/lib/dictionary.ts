/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

import { Ajax, IAjaxResponse } from './ajax';
import { IMarkdownPage, IMarkdownSection } from './markdown';
import { Utilities } from './utilities';

/* *
 *
 *  Interfaces
 *
 * */

/**
 * Dictionary with sections
 */
export interface IDictionaryEntry extends IMarkdownPage {
    [sectionKey: string]: IDictionarySection;
}

/**
 * Dictionary section with categories
 */
export interface IDictionarySection extends IMarkdownSection {
    [categoryKey: string]: Array<string>;
}

/* *
 *
 *  Classes
 *
 * */

/**
 * Manages dictionary communication with a server.
 */
export class Dictionary extends Ajax {

    /* *
     *
     *  Static Variables
     *
     * */

    /**
     * File extension of dictionary entries.
     */
    public static readonly FILE_EXTENSION = '.txt';

    /**
     * Character to separate a base file name from its page index.
     */
    public static readonly FILE_SEPARATOR = '-';

    /**
     * Line character to separate sections.
     */
    public static readonly LINE_SEPARATOR = '\n';

    /**
     * Character to separate a category from its values.
     */
    public static readonly PAIR_SEPARATOR = ':';

    /**
     * Character to separate a category's values.
     */
    public static readonly VALUE_SEPARATOR = ';';

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
    public static parse (stringified: string): IDictionaryEntry {

        const dictionaryPage = {} as IDictionaryEntry;

        let categorySplit: Array<string>;
        let dictionarySection: IMarkdownSection;

        stringified
            .split(Dictionary.LINE_SEPARATOR)
            .forEach(function (line: string): void {

                if (line.indexOf(Dictionary.PAIR_SEPARATOR) === -1) {
                    dictionaryPage[line] = dictionarySection = {};
                    return;
                }

                if (!dictionarySection) {
                    return;
                }

                categorySplit = line.split(Dictionary.PAIR_SEPARATOR, 2);

                dictionarySection[categorySplit[0]] = (
                    categorySplit[1].split(Dictionary.VALUE_SEPARATOR)
                );
            });

        return dictionaryPage;
    }

    /**
     * Converts a Markdown page into a dictionary text.
     *
     * @param markdownPage
     *        Markdown page
     */
    public static stringify(markdownPage: IMarkdownPage): string {

        const stringified = [] as Array<string>;

        let markdownSection: IMarkdownSection;

        Object
            .keys(markdownPage)
            .forEach(function (headline: string): void {

                stringified.push(Utilities.getKey(headline))

                markdownSection = markdownPage[headline];

                Object
                    .keys(markdownSection)
                    .forEach(category =>
                        stringified.push(
                            Utilities.getKey(category) +
                            Dictionary.PAIR_SEPARATOR +
                            markdownSection[category].join(Dictionary.VALUE_SEPARATOR)
                        )
                    );
            });

        return stringified.join(Dictionary.LINE_SEPARATOR);
    }

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
     *
     * @param pageIndex
     *        Index of the entry page to load
     */
    public loadEntry (
        baseName: string,
        pageIndex: number = 0
    ): Promise<(IDictionaryEntry|undefined)> {

        return this
            .request(
                Utilities.getKey(baseName) +
                Dictionary.FILE_SEPARATOR +
                pageIndex +
                Dictionary.FILE_EXTENSION
            )
            .then(function (response: IAjaxResponse): (IDictionaryEntry|undefined) {

                if (
                    response instanceof Error ||
                    response.serverStatus >= 400
                ) {
                    return;
                }

                return Dictionary.parse(response.result);
            })
            .catch(function (error?: Error): undefined {

                console.error(error);

                return;
            });
    }
}
