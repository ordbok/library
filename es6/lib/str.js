var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BRACKET_REGEXP = /\([^\)]*\)|\[[^\]]*\]|\{[^\}]*\}/g;
var SPACE_REGEXP = /\s+/g;
var Str = (function (_super) {
    __extends(Str, _super);
    function Str(str) {
        return _super.call(this, str) || this;
    }
    Str.endsWith = function (str, pattern) {
        if (str === pattern) {
            return true;
        }
        var strLength = str.length;
        var patternLength = pattern.length;
        return (patternLength <= strLength &&
            str.lastIndexOf(pattern) === strLength - patternLength);
    };
    Str.removeBrackets = function (str) {
        return str.replace(BRACKET_REGEXP, '').replace(SPACE_REGEXP, ' ').trim();
    };
    Str.trimSpaces = function (str) {
        return str.replace(SPACE_REGEXP, ' ').trim();
    };
    Str.prototype.endsWith = function (pattern) {
        return Str.endsWith(this.toString(), pattern);
    };
    Str.prototype.removeBrackets = function () {
        return new Str(Str.removeBrackets(this.toString()));
    };
    Str.prototype.trimSpaces = function () {
        return new Str(Str.trimSpaces(this.toString()));
    };
    return Str;
}(String));
export { Str };
