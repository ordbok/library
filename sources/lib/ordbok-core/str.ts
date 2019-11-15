/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

/* *
 *
 *  Constants
 *
 * */

/**
 * Inclusive brackets pattern
 */
const BRACKET_REGEXP = /\([^\)]*\)|\[[^\]]*\]|\{[^\}]*\}/g;

/**
 * Inclusive space pattern
 */
const SPACE_REGEXP = /\s+/g;

/* *
 *
 *  Classes
 *
 * */

/**
 * String utility class.
 */
export class Str extends String
{
    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Tests for a matching pattern at the string end.
     *
     * @param str
     *        String to test.
     *
     * @param pattern
     *        Pattern to match.
     */
    public static endsWith (str: string, pattern: string): boolean
    {
        if (str === pattern)
        {
            return true;
        }

        const strLength = str.length;
        const patternLength = pattern.length;

        return (
            patternLength <= strLength &&
            str.lastIndexOf(pattern) === strLength - patternLength
        );
    }

    /**
     * Removes brackets and their content.
     *
     * @param str
     *        String to filter.
     */
    public static removeBrackets (str: string): string
    {
        return str.replace(BRACKET_REGEXP, '').replace(SPACE_REGEXP, ' ').trim();
    }

    /**
     * Trims all unnecessary spaces.
     *
     * @param str
     *        String to filter.
     */
    public static trimSpaces (str: string): string
    {
        return str.replace(SPACE_REGEXP, ' ').trim();
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor (str?: string)
    {
        super(str);
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Tests for a matching pattern at the string end.
     *
     * @param pattern
     *        Pattern to match.
     */
    public endsWith (pattern: string): boolean
    {
        return Str.endsWith(this.toString(), pattern);
    }

    /**
     * Removes brackets and their content.
     */
    public removeBrackets (): Str
    {
        return new Str(Str.removeBrackets(this.toString()));
    }

    /**
     * Trims all unnecessary spaces.
     */
    public trimSpaces (): Str
    {
        return new Str(Str.trimSpaces(this.toString()));
    }
}
