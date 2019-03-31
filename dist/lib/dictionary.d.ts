import { Ajax } from './ajax';
import { IMarkdownPage } from './markdown';
export declare class Dictionary extends Ajax {
    /**
     * Converts a dictionary text into a Markdown page.
     *
     * @param stringified
     *        Dictionary text
     */
    static parse(stringified: string): IMarkdownPage;
    /**
     * Converts a Markdown page into a dictionary text.
     *
     * @param markdownPage
     *        Markdown page
     */
    static stringify(markdownPage: IMarkdownPage): string;
    /**
     * Loads a dictionary entry from the server.
     *
     * @param baseName
     *        Base name of the translation file
     */
    loadEntry(baseName: string): Promise<IMarkdownPage | undefined>;
}
