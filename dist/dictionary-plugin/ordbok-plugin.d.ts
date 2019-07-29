/** @internal */
import { IMarkdownPage, IPlugin } from '../';
/**
 * Default plugin to create dictionary text files.
 */
export declare class DictionaryPlugin implements IPlugin {
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
