"use strict";
/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var FS = require("fs");
var lib_1 = require("../lib");
var plugin_1 = require("../plugin");
/* *
 *
 *  Classes
 *
 * */
/**
 * Default plugin to create dictionary text files.
 */
var DictionaryPlugin = /** @class */ (function () {
    function DictionaryPlugin() {
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Gets called after the assembling has been done.
     */
    DictionaryPlugin.prototype.onAssembled = function () {
        // nothing to do
    };
    /**
     * Gets called before the assembling begins.
     */
    DictionaryPlugin.prototype.onAssembling = function () {
        // nothing to do
    };
    /**
     * Gets called after a markdown file has been read.
     */
    DictionaryPlugin.prototype.onReadFile = function () {
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
    DictionaryPlugin.prototype.onWriteFile = function (targetFile, markdownPage) {
        var filePath = targetFile + lib_1.Dictionary.FILE_EXTENSION;
        plugin_1.PluginUtilities.makeFilePath(filePath);
        FS.writeFileSync(filePath, lib_1.Dictionary.stringify(markdownPage));
    };
    return DictionaryPlugin;
}());
exports.DictionaryPlugin = DictionaryPlugin;
/* *
 *
 *  Plugin Export
 *
 * */
exports.ordbokPlugin = new DictionaryPlugin();
