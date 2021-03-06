export declare module Utilities {
    /**
     * Returns the extension of a file path.
     *
     * @param filePath
     * File path
     */
    function getExtension(filePath: string): string;
    /**
     * Returns the base name of a file path.
     *
     * @param filePath
     * File path
     */
    function getBaseName(filePath: string): string;
    /**
     * Returns the universal key for the given text.
     *
     * @param text
     * Text to generate key from
     */
    function getKey(text: string): string;
    /**
     * Normalize a text to lower case characters and space only.
     *
     * @param text
     * Text to filter
     */
    function getNorm(text: string): string;
    /**
     * Returns the parent part of the path.
     *
     * @param path
     * Path with parent
     */
    function getParentPath(path: string): string;
    /**
     * Removes brackets and their content.
     *
     * @param str
     *        String to filter.
     */
    function removeBrackets(str: string): string;
    /**
     * Binary rotation of a given text.
     *
     * @param text
     * Text to rotate
     */
    function rotate(text: string): string;
    /**
     * Simplifies nested arrays and object properties to a single array of
     * values.
     *
     * @param obj
     * Object to reduce
     */
    function splat<T>(obj: object): Array<T>;
    /**
     * Trims all unnecessary spaces.
     *
     * @param str
     * String to filter.
     */
    function trimSpaces(str: string): string;
}
export default Utilities;
