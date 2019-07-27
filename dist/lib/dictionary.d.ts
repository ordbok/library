import { Ajax } from './ajax';
import { IMarkdownPage, IMarkdownSection } from './markdown';
/**
 * Dictionary with sections
 */
export interface IDictionaryEntry extends IMarkdownPage {
    [sectionKey: string]: IDictionarySection;
}
/**
 * Dictionary section with categories
 */
export interface IDictionarySection extends IMarkdownSection {
    [categoryKey: string]: Array<string>;
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
     * Character to separate a base file name from its page index.
     */
    static readonly FILE_SEPARATOR = "-";
    /**
     * Line character to separate sections.
     */
    static readonly LINE_SEPARATOR = "\n";
    /**
     * Character to separate a category from its values.
     */
    static readonly PAIR_SEPARATOR = ":";
    /**
     * Character to separate a category's values.
     */
    static readonly VALUE_SEPARATOR = ";";
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
     *
     * @param pageIndex
     *        Index of the entry page to load
     */
    loadEntry(baseName: string, pageIndex?: number): Promise<(IDictionaryEntry | undefined)>;
}
