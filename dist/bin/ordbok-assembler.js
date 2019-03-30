#!/usr/bin/env node
"use strict";
/**
 * @internal
 * @license MIT
 * @author Sophie Bremer
 */
Object.defineProperty(exports, "__esModule", { value: true });
var FS = require("fs");
var Ordbok = require("../lib/index");
var Path = require("path");
/* *
 *
 *  Constants
 *
 * */
/**
 * Command line arguments
 */
var ARGV = process.argv.slice(2).map(mapArgv);
/**
 * Default plugin path
 */
var PLUGIN = Path.join(__dirname, '..');
/**
 * Ordbok package configuration
 */
var PACKAGE = require('../../package.json');
/**
 * Command line help
 */
var HELP = "Ordbok v" + (PACKAGE.version || '0.0.0') + "\n\nordbok-assembler [options] source target\n\nOptions:\n  -h --help     This help information\n  -v --version  Version";
/* *
 *
 *  Variables
 *
 * */
/**
 * Loaded configuration
 */
var _config = {
    plugins: [PLUGIN]
};
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
function assemble(sourceFolder, targetFolder) {
    var plugins = [];
    _config.plugins.forEach(function (pluginPath) {
        return getFiles(pluginPath, /(?:^|\/)ordbok-plugin\.js$/).forEach(function (pluginFile) {
            return plugins.push(require(pluginFile).ordbokPlugin);
        });
    });
    if (plugins.length === 0) {
        return;
    }
    plugins.forEach(function (plugin) {
        return plugin.onAssembling(sourceFolder, targetFolder);
    });
    getFiles(sourceFolder, /\.(?:md|markdown)$/).forEach(function (sourceFile) {
        var markdown = new Ordbok.Markdown(FS.readFileSync(sourceFile).toString());
        plugins.forEach(function (plugin) { return plugin.onReadFile(sourceFile, markdown); });
        markdown.pages.forEach(function (markdownPage, index) {
            var targetFile = Path.join(targetFolder, (Ordbok.Utilities.getBaseName(sourceFile) + '-' + index));
            plugins.forEach(function (plugin) {
                return plugin.onWriteFile(targetFile, markdownPage);
            });
        });
    });
    plugins.forEach(function (plugin) {
        return plugin.onAssembled();
    });
}
/**
 * Command line interface
 */
function cli() {
    try {
        if (ARGV.includes('--help')) {
            console.log(HELP);
            return;
        }
        if (ARGV.includes('--version')) {
            console.log(PACKAGE.version);
            return;
        }
        if (ARGV.length < 2) {
            throw new Error('Invalid arguments');
        }
        var sourceDirectory = ARGV[ARGV.length - 2];
        var targetDirectory = ARGV[ARGV.length - 1];
        if (sourceDirectory[0] === '-' ||
            targetDirectory[1] === '-') {
            throw new Error('Invalid arguments');
        }
        config('ordbok.json');
        assemble(sourceDirectory, targetDirectory);
    }
    catch (catchedError) {
        error(catchedError);
    }
}
/**
 * Loads Ordbok configuration from the current working folder
 *
 * @param configPath
 *        Configuration path
 */
function config(configPath) {
    if (!FS.existsSync(configPath)) {
        return;
    }
    var configFolder = Path.dirname(configPath);
    _config = JSON.parse(FS.readFileSync('ordbok.json').toString());
    if (!_config.plugins ||
        _config.plugins.length === 0) {
        _config.plugins = [PLUGIN];
    }
    else {
        _config.plugins = _config.plugins
            .map(function (pluginPath) { return (pluginPath[0] === '.' ?
            Path.join(configFolder, pluginPath) :
            pluginPath); });
    }
}
/**
 * Reports an error
 *
 * @param error
 *        Error
 */
function error(error) {
    console.error('\nError: ' + error.message + '\n');
}
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
        if (sourceEntry.isFile() &&
            (!pattern || pattern.test(path))) {
            files.push(path);
        }
    });
    return files;
}
/**
 * Maps shortcuts of command line arguments
 *
 * @param arg
 *        Argument to map
 */
function mapArgv(arg) {
    switch (arg) {
        default:
            return arg;
        case '-h':
            return '--help';
        case '-v':
            return '--version';
    }
}
/* *
 *
 *  Runtime
 *
 * */
cli();