/**
 * Text utility class.
 */
export declare class Text extends String {
    /**
     * Tests for a matching pattern at the text end.
     *
     * @param text
     *        Text to test.
     *
     * @param pattern
     *        Pattern to match.
     */
    static endsWith(text: string, pattern: string): boolean;
    /**
     * Removes brackets and their content.
     *
     * @param text
     *        Text to filter.
     */
    static removeBrackets(text: string): string;
    /**
     * Trims all unnecessary spaces.
     *
     * @param text
     *        Text to filter.
     */
    static trimSpaces(text: string): string;
    constructor(text?: string);
    /**
     * Tests for a matching pattern at the text end.
     *
     * @param pattern
     *        Pattern to match.
     */
    endsWith(pattern: string): boolean;
    /**
     * Removes brackets and their content.
     */
    removeBrackets(): Text;
    /**
     * Trims all unnecessary spaces.
     */
    trimSpaces(): Text;
}
