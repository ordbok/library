/**
 * String utility class.
 */
export declare class Str extends String {
    /**
     * Tests for a matching pattern at the string end.
     *
     * @param str
     *        String to test.
     *
     * @param pattern
     *        Pattern to match.
     */
    static endsWith(str: string, pattern: string): boolean;
    /**
     * Removes brackets and their content.
     *
     * @param str
     *        String to filter.
     */
    static removeBrackets(str: string): string;
    /**
     * Trims all unnecessary spaces.
     *
     * @param str
     *        String to filter.
     */
    static trimSpaces(str: string): string;
    constructor(str?: string);
    /**
     * Tests for a matching pattern at the string end.
     *
     * @param pattern
     *        Pattern to match.
     */
    endsWith(pattern: string): boolean;
    /**
     * Removes brackets and their content.
     */
    removeBrackets(): Str;
    /**
     * Trims all unnecessary spaces.
     */
    trimSpaces(): Str;
}
