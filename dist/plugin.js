"use strict";
/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
/* @internal */
var FS = require("fs");
var Path = require("path");
/* *
 *
 *  Module
 *
 * */
var PluginUtilities;
(function (PluginUtilities) {
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Creates all necessary folders for a given file path.
     *
     * @param filePath
     *        File path to establish
     */
    function makeFilePath(filePath) {
        var currentPath = '';
        Path
            .normalize(Path.dirname(filePath))
            .split(Path.sep)
            .map(function (entry, index) {
            return currentPath += (index ? Path.sep : '') + entry;
        })
            .forEach(function (path) {
            if (!FS.existsSync(path)) {
                FS.mkdirSync(path);
            }
        });
    }
    PluginUtilities.makeFilePath = makeFilePath;
    function writeFileSync(filePath, fileContent, options) {
        PluginUtilities.makeFilePath(filePath);
        FS.writeFileSync(filePath, fileContent, options);
    }
    PluginUtilities.writeFileSync = writeFileSync;
})(PluginUtilities = exports.PluginUtilities || (exports.PluginUtilities = {}));
