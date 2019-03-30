/**
 * @license MIT
 * @author Sophie Bremer
 */
export declare class Text {
    static endsWith(text: string, pattern: string): boolean;
    static trimSpaces(text: string): string;
    constructor(text: string);
    private _value;
    endsWith(pattern: string): boolean;
    trimSpaces(): Text;
}
