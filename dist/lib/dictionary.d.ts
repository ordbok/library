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
/**
 * Manages dictionary communication with a server.
 */
export declare class Dictionary extends Ajax {
    /**
     * File extension of dictionary entries.
     */
    static readonly FILE_EXTENSION = ".txt";
    /**
     * Converts a text into a dictionary entry.
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
