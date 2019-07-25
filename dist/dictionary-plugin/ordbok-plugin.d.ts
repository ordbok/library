/** @internal */
import { IMarkdownPage, IPlugin } from '../';
/**
 * Default plugin to create dictionary text files.
 */
export declare class DictionaryPlugin implements IPlugin {
    /**
     * Gets called after the assembling has been done.
     */
    onAssembled(): void;
    /**
     * Gets called before the assembling begins.
     */
    onAssembling(): void;
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
export declare const ordbokPlugin: DictionaryPlugin;
