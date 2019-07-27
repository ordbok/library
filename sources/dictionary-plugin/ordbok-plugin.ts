/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

/** @internal */

import { Dictionary, IMarkdownPage, Internals, IPlugin } from '../';

/* *
 *
 *  Classes
 *
 * */

/**
 * Default plugin to create dictionary text files.
 */
export class DictionaryPlugin implements IPlugin {

    /* *
     *
     *  Events
     *
     * */

    /**
     * Gets called before a dictionary file will be written.
     *
     * @param targetFile
     *        Dictionary file path
     *
     * @param markdownPage
     *        Logical file content
     */
    public onWriteFile (targetFile: string, markdownPage: IMarkdownPage) {

        Internals.writeFile(
            (targetFile + Dictionary.FILE_EXTENSION),
            Dictionary.stringify(markdownPage)
        );
    }
}

/* *
 *
 *  Plugin Export
 *
 * */

export const ordbokPlugin = new DictionaryPlugin();
