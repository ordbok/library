/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

import { Ajax } from './ajax';
import { IMarkdownPage, IMarkdownSection } from './markdown';
import { Utilities } from './utilities';

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
     * Converts a dictionary text into a Markdown page.
     *
     * @param stringified
     *        Dictionary text
     */
    public static parse (stringified: string): IMarkdownPage {

        const markdownPage = {} as IMarkdownPage;

        let categorySplit: Array<string>;
        let markdownSection: IMarkdownSection;

        stringified
            .split('\n')
            .forEach(line => {

                if (line.indexOf(':') === -1) {
                    markdownPage[line] = markdownSection = {};
                    return;
                }

                if (!markdownSection) {
                    return;
                }

                categorySplit = line.split(':', 2);

                markdownSection[categorySplit[0]] = categorySplit[1].split(',');
            });

        return markdownPage;
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
                            Utilities.getKey(category) + ':' + markdownSection[category].join(',')
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
    public loadEntry (baseName: string): Promise<IMarkdownPage|undefined> {

        return new Promise((resolve) => {

            this
                .request(Utilities.getKey(baseName) + '.txt')
                .then(response => {

                    if (response instanceof Error ||
                        response.serverStatus >= 400
                    ) {
                        return undefined;
                    }

                    const responseFile = (
                        Dictionary.parse(response.result) as IMarkdownPage
                    );

                    if (responseFile &&
                        !(responseFile instanceof Array)
                    ) {
                        return responseFile;
                    }

                    return undefined;
                })
                .catch(error => {

                    console.error(error);

                    return undefined;
                })
                .then(resolve);
        });
    }
}
