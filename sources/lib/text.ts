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
 * Text utility class.
 */
export class Text extends String {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Tests for a matching pattern at the text end.
     *
     * @param text
     *        Text to test.
     *
     * @param pattern
     *        Pattern to match.
     */
    public static endsWith (text: string, pattern: string): boolean {

        if (text === pattern) {
            return true;
        }

        const textLength = text.length;
        const patternLength = pattern.length;

        return (
            patternLength <= textLength &&
            text.lastIndexOf(pattern) === textLength - patternLength
        );
    }

    /**
     * Removes brackets and their content.
     *
     * @param text
     *        Text to filter.
     */
    public static removeBrackets (text: string): string {

        return text.replace(BRACKET_REGEXP, '').replace(SPACE_REGEXP, ' ').trim();
    }

    /**
     * Trims all unnecessary spaces.
     *
     * @param text
     *        Text to filter.
     */
    public static trimSpaces (text: string): string {

        return text.replace(SPACE_REGEXP, ' ').trim();
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor (text?: string) {

        super(text);
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Tests for a matching pattern at the text end.
     *
     * @param pattern
     *        Pattern to match.
     */
    public endsWith (pattern: string): boolean {

        return Text.endsWith(this.toString(), pattern);
    }

    /**
     * Removes brackets and their content.
     */
    public removeBrackets (): Text {

        return new Text(Text.removeBrackets(this.toString()));
    }

    /**
     * Trims all unnecessary spaces.
     */
    public trimSpaces (): Text {

        return new Text(Text.trimSpaces(this.toString()));
    }
}
