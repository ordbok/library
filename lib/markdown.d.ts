/**
 * Page with headline separated sections
 */
export interface IMarkdownPage {
    [headline: string]: IMarkdownSection;
}
/**
 * Sections after a page headline
 */
export interface IMarkdownSection {
    [key: string]: Array<string>;
}
/**
 * Markdown parser
 */
export declare class Markdown {
    /**
     * Internal markdown page parser
     *
     * @param markdownPage
     *        Markdown page
     */
    private static parsePage;
    /**
     * Parse markdown.
     *
     * @param markdown
     *        Markdown to parse
     */
    constructor(markdown: string);
    /**
     * Internal markdown pages
     */
    private _pages;
    /**
     * Internal raw markdown
     */
    private _raw;
    /**
     * Markdown pages
     */
    get pages(): Array<IMarkdownPage>;
    /**
     * Raw markdown
     */
    get raw(): string;
    /**
     * Internal markdown parser
     *
     * @param markdown
     *        Markdown to parse
     */
    private parse;
}
export default Markdown;
