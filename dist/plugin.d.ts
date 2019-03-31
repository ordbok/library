import { IMarkdownPage, Markdown } from './lib/markdown';
/**
 * Interface of an `ordbokPlugin` export
 */
export interface IPlugin {
    /**
     * Called after assembling.
     */
    onAssembled(): void;
    /**
     * Called before assembling.
     *
     * @param sourceFolder
     *        Source folder
     *
     * @param targetFolder
     *        Target folder
     */
    onAssembling(sourceFolder: string, targetFolder: string): void;
    /**
     * Called after reading a markdown file.
     *
     * @param sourceFile
     *        Source file
     *
     * @param markdown
     *        File's markdown
     */
    onReadFile(sourceFile: string, markdown: Markdown): void;
    /**
     * Called before writing a dictionary entry.
     *
     * @param targetFile
     *        Target file
     *
     * @param markdownPage
     *        File's markdown
     */
    onWriteFile(targetFile: string, markdownPage: IMarkdownPage): void;
}
export declare module PluginUtilities {
    /**
     * Creates all necessary folders for a given file path.
     *
     * @param filePath
     *        File path to establish
     */
    function makeFilePath(filePath: string): void;
}
