"use strict";
/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var FS = require("fs");
var index_1 = require("../lib/index");
var plugin_1 = require("../plugin");
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
        var filePath = targetFile + '.txt';
        plugin_1.PluginUtilities.makeFilePath(filePath);
        FS.writeFileSync(filePath, index_1.Dictionary.stringify(markdownPage));
    };
    return TextPlugin;
}());
exports.TextPlugin = TextPlugin;
