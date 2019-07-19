/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

import * as FS from 'fs';
import { Dictionary, IMarkdownPage } from '../lib';
import { IPlugin, PluginUtilities } from '../plugin';

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
     *  Functions
     *
     * */

    /**
     * Gets called after the assembling has been done.
     */
    public onAssembled () {

        // nothing to do
    }

    /**
     * Gets called before the assembling begins.
     */
    public onAssembling () {

        // nothing to do
    }

    /**
     * Gets called after a markdown file has been read.
     */
    public onReadFile () {

        // nothing to do
    }

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

        PluginUtilities.writeFileSync(
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
