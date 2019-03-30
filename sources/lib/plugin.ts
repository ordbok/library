/**
 * @license MIT
 * @author Sophie Bremer
 */

import { IMarkdownPage, Markdown } from './markdown';

/* *
 *
 *  Interfaces
 *
 * */

/**
 * Interface of an Ordbok plugins exported `ordbokPlugin` object
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
