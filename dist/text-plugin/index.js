"use strict";
/**
 * @license MIT
 * @author Sophie Bremer
 */
Object.defineProperty(exports, "__esModule", { value: true });
var FS = require("fs");
/* *
 *
 *  Classes
 *
 * */
/**
 * Default plugin to create dictionary text files.
 */
var TextPlugin = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    /**
     * Creates a plugin instance.
     */
    function TextPlugin() {
        this._sourceFolder = '';
        this._targetFolder = '';
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Converts a Markdown page into a dictionary text.
     *
     * @param markdownPage
     *        Markdown page
     */
    TextPlugin.stringify = function (markdownPage) {
        var resultLines = [];
        var section;
        Object
            .keys(markdownPage)
            .forEach(function (headline) {
            resultLines.push(headline);
            section = markdownPage[headline];
            Object
                .keys(section)
                .forEach(function (category) {
                return resultLines.push(category + ':' + section[category].join(','));
            });
        });
        return resultLines.join('\n');
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Gets called after the assembling has been done.
     */
    TextPlugin.prototype.onAssembled = function () {
        // nothing to do
    };
    /**
     * Gets called before the assembling begins.
     *
     * @param sourceFolder
     *        Markdown folder
     *
     * @param targetFolder
     *        Dictionary folder
     */
    TextPlugin.prototype.onAssembling = function (sourceFolder, targetFolder) {
        this._sourceFolder = sourceFolder;
        this._targetFolder = targetFolder;
    };
    /**
     * Gets called after a markdown file has been read.
     */
    TextPlugin.prototype.onReadFile = function () {
        // nothing to do
    };
    /**
     * Gets called before a dictionary file will be written.
     *
     * @param targetFile
     *        Dictionary file path
     *
     * @param markdownPage
     *        Logical file content
     */
    TextPlugin.prototype.onWriteFile = function (targetFile, markdownPage) {
        FS.writeFileSync(targetFile + '.txt', TextPlugin.stringify(markdownPage));
    };
    return TextPlugin;
}());
exports.TextPlugin = TextPlugin;
