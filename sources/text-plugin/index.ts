/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

import * as FS from 'fs';
import { Dictionary, IMarkdownPage } from '../lib/index';
import { IPlugin, PluginUtilities } from '../plugin';

/* *
 *
 *  Classes
 *
 * */

/**
 * Default plugin to create dictionary text files.
 */
export class TextPlugin implements IPlugin {

    /* *
     *
     *  Constructors
     *
     * */

    /**
     * Creates a plugin instance.
     */
    public constructor () {

        this._sourceFolder = '';
        this._targetFolder = '';
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Markdown folder
     */
    private _sourceFolder: string;

    /**
     * Dictionary folder
     */
    private _targetFolder: string;

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
     *
     * @param sourceFolder
     *        Markdown folder
     *
     * @param targetFolder
     *        Dictionary folder
     */
    public onAssembling (sourceFolder: string, targetFolder: string) {

        this._sourceFolder = sourceFolder;
        this._targetFolder = targetFolder;
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

        const filePath = targetFile + '.txt';

        PluginUtilities.makeFilePath(filePath);
        FS.writeFileSync(filePath, Dictionary.stringify(markdownPage));
    }
}
