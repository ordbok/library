import { Ajax } from './ajax';
import { IMarkdownPage, IMarkdownSection } from './markdown';
/**
 * Dictionary with sections
 */
export interface IDictionaryEntry extends IMarkdownPage {
    [section: string]: IDictionarySection;
}
/**
 * Dictionary section with categories
 */
export interface IDictionarySection extends IMarkdownSection {
    [category: string]: Array<string>;
}
export declare class Dictionary extends Ajax {
    /**
     * Converts a dictionary text into a Markdown page.
     *
     * @param stringified
     *        Dictionary text
     */
    static parse(stringified: string): IDictionaryEntry;
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
    loadEntry(baseName: string): Promise<IDictionaryEntry>;
}
