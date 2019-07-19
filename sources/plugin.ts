/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

/* @internal */

import * as FS from 'fs';
import { IMarkdownPage, Markdown } from './lib/markdown';
import * as Path from 'path';

/* *
 *
 *  Interfaces
 *
 * */

/**
 * Interface of an `ordbokPlugin` export
 */
export interface IPlugin {

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Called after assembling.
     */
    onAssembled (): void;

    /**
     * Called before assembling.
     *
     * @param sourceFolder
     *        Source folder
     *
     * @param targetFolder
     *        Target folder
     */
    onAssembling (sourceFolder: string, targetFolder: string): void;

    /**
     * Called after reading a markdown file.
     *
     * @param sourceFile
     *        Source file
     *
     * @param markdown
     *        File's markdown
     */
    onReadFile (sourceFile: string, markdown: Markdown): void;

    /**
     * Called before writing a dictionary entry.
     *
     * @param targetFile
     *        Target file
     *
     * @param markdownPage
     *        File's markdown
     */
    onWriteFile (targetFile: string, markdownPage: IMarkdownPage): void;
}

/* *
 *
 *  Module
 *
 * */

export module PluginUtilities {

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Creates all necessary folders for a given file path.
     *
     * @param filePath
     *        File path to establish
     */
    export function makeFilePath (filePath: string) {

        let currentPath = '';

        Path
            .normalize(Path.dirname(filePath))
            .split(Path.sep)
            .map((entry, index) => {
                return currentPath += (index ? Path.sep : '') + entry;
            })
            .forEach((path) => {
                if (!FS.existsSync(path)) {
                    FS.mkdirSync(path);
                }
            });
    }

    export function writeFileSync (
        filePath: string,
        fileContent: string,
        options?: FS.WriteFileOptions
    ) {

        PluginUtilities.makeFilePath(filePath);

        FS.writeFileSync(filePath, fileContent, options);
    }
}
