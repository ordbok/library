/**
 * @license MIT
 * @author Sophie Bremer
 */
import { IMarkdownPage } from '../lib/index';
import { IPlugin } from '../plugin';
/**
 * Default plugin to create dictionary text files.
 */
export declare class TextPlugin implements IPlugin {
    /**
     * Converts a Markdown page into a dictionary text.
     *
     * @param markdownPage
     *        Markdown page
     */
    static stringify(markdownPage: IMarkdownPage): string;
    /**
     * Creates a plugin instance.
     */
    constructor();
    /**
     * Markdown folder
     */
    private _sourceFolder;
    /**
     * Dictionary folder
     */
    private _targetFolder;
    /**
     * Gets called after the assembling has been done.
     */
    onAssembled(): void;
    /**
     * Gets called before the assembling begins.
     *
     * @param sourceFolder
     *        Markdown folder
     *
     * @param targetFolder
     *        Dictionary folder
     */
    onAssembling(sourceFolder: string, targetFolder: string): void;
    /**
     * Gets called after a markdown file has been read.
     */
    onReadFile(): void;
    /**
     * Gets called before a dictionary file will be written.
     *
     * @param targetFile
     *        Dictionary file path
     *
     * @param markdownPage
     *        Logical file content
     */
    onWriteFile(targetFile: string, markdownPage: IMarkdownPage): void;
}
