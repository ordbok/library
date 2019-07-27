"use strict";
/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
/** @internal */
var FS = require("fs");
var Path = require("path");
var lib_1 = require("./lib");
/* *
 *
 *  Module
 *
 * */
/**
 * Internal utilities
 */
var Internals;
(function (Internals) {
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Assembles markdown files with the help of plugins
     *
     * @param sourceFolder
     *        Source folder
     *
     * @param targetFolder
     *        Target folder
     */
    function assembleFiles(sourceFolder, targetFolder, config) {
        var plugins = [];
        config.plugins.forEach(function (pluginPath) {
            return getFiles(pluginPath, /(?:^|\/)ordbok-plugin\.js$/).forEach(function (pluginFile) {
                return plugins.push(require(pluginFile).ordbokPlugin);
            });
        });
        if (plugins.length === 0) {
            return;
        }
        plugins.forEach(function (plugin) {
            return plugin.onAssembling &&
                plugin.onAssembling(sourceFolder, targetFolder);
        });
        getFiles(sourceFolder, /\.(?:md|markdown)$/).forEach(function (sourceFile) {
            var markdown = new lib_1.Markdown(FS.readFileSync(sourceFile).toString());
            plugins.forEach(function (plugin) {
                return plugin.onReadFile &&
                    plugin.onReadFile(sourceFile, markdown);
            });
            markdown.pages.forEach(function (markdownPage, pageIndex) {
                return plugins.forEach(function (plugin) {
                    return plugin.onWriteFile &&
                        plugin.onWriteFile(Path.join(targetFolder, (lib_1.Utilities.getBaseName(sourceFile) +
                            lib_1.Dictionary.FILE_SEPARATOR +
                            pageIndex)), markdownPage);
                });
            });
        });
        plugins.forEach(function (plugin) {
            return plugin.onAssembled &&
                plugin.onAssembled();
        });
    }
    Internals.assembleFiles = assembleFiles;
    /**
     * Loads the configuration from the current working folder
     *
     * @param configPath
     *        Configuration path
     */
    function getConfig(configPath, defaultConfig) {
        if (!FS.existsSync(configPath)) {
            return defaultConfig;
        }
        var configFolder = Path.dirname(configPath);
        var config = JSON.parse(FS.readFileSync(configPath).toString());
        if (!config.plugins ||
            config.plugins.length === 0) {
            config.plugins = defaultConfig.plugins;
        }
        else {
            config.plugins = config.plugins.map(function (pluginPath) {
                return pluginPath[0] !== Path.sep ?
                    Path.join(configFolder, pluginPath) :
                    pluginPath;
            });
        }
        return config;
    }
    Internals.getConfig = getConfig;
    /**
     * Returns all files in a given folder and subfolders.
     *
     * @param sourceFolder
     *        Source folder
     *
     * @param pattern
     *        Pattern
     */
    function getFiles(sourceFolder, pattern) {
        var files = [];
        if (!FS.existsSync(sourceFolder)) {
            return files;
        }
        FS
            .readdirSync(sourceFolder, { withFileTypes: true })
            .forEach(function (sourceEntry) {
            var path = Path.join(sourceFolder, sourceEntry.name);
            if (sourceEntry.isDirectory()) {
                files.push.apply(files, getFiles(path, pattern));
            }
            else if (sourceEntry.isFile() &&
                (!pattern || pattern.test(path))) {
                files.push(path);
            }
        });
        return files;
    }
    Internals.getFiles = getFiles;
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
            return !FS.existsSync(path) ?
                FS.mkdirSync(path) :
                undefined;
        });
    }
    Internals.makeFilePath = makeFilePath;
    /**
     * Creates a file with the given path. Creates all necessary folders.
     *
     * @param filePath
     *        File path to establish
     *
     * @param fileContent
     *        File content to write
     *
     * @param options
     *        Write options
     */
    function writeFile(filePath, fileContent, options) {
        makeFilePath(filePath);
        FS.writeFileSync(filePath, fileContent, options);
    }
    Internals.writeFile = writeFile;
})(Internals = exports.Internals || (exports.Internals = {}));
