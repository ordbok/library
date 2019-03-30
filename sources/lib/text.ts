/**
 * @license MIT
 * @author Sophie Bremer
 */

/* *
 *
 *  Constants
 *
 * */

/**
 * Inclusive space pattern
 */
const SPACE_REGEXP = /\s+/g;

/* *
 *
 *  Classes
 *
 * */

export class Text {

    /* *
     *
     *  Static Functions
     *
     * */

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

    public static trimSpaces (text: string): string {

        return text.replace(SPACE_REGEXP, ' ').trim();
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor (text: string) {

        this._value = text;
    }

    /* *
     *
     *  Properties
     *
     * */

    private _value: string;

    /* *
     *
     *  Functions
     *
     * */

    public endsWith (pattern: string): boolean {
        return Text.endsWith(this._value, pattern);
    }

    public trimSpaces (): Text {
        return new Text(Text.trimSpaces(this._value));
    }
}
