/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

import { Ajax } from './ajax';
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
    [section: string]: IDictionarySection;
}

/**
 * Dictionary section with categories
 */
export interface IDictionarySection extends IMarkdownSection {
    [category: string]: Array<string>;
}

/* *
 *
 *  Classes
 *
 * */

export class Dictionary extends Ajax {

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
            .split('\n')
            .forEach(line => {

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
            .forEach(headline => {

                stringified.push(Utilities.getKey(headline))

                markdownSection = markdownPage[headline];

                Object
                    .keys(markdownSection)
                    .forEach(category =>
                        stringified.push(
                            Utilities.getKey(category) + ':' + markdownSection[category].join(';')
                        )
                    );
            });

        return stringified.join('\n');
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
     */
    public loadEntry (baseName: string): Promise<IDictionaryEntry> {

        return new Promise((resolve) => {

            this
                .request(Utilities.getKey(baseName) + '.txt')
                .then(response => {

                    if (response instanceof Error ||
                        response.serverStatus >= 400
                    ) {
                        return undefined;
                    }

                    return Dictionary.parse(response.result);
                })
                .catch(error => {

                    console.error(error);

                    return undefined;
                })
                .then(resolve);
        });
    }
}
