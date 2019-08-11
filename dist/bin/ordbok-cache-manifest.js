#!/usr/bin/env node
"use strict";
/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
/** @internal */
var Path = require("path");
var __1 = require("../");
/* *
 *
 *  Constants
 *
 * */
/**
 * Command line arguments
 */
var ARGV = process.argv.slice(2).map(function (argv) { return ARGV_MAP[argv] || argv; });
/**
 * Command line arguments shortcuts
 */
var ARGV_MAP = {
    '-a': '--all',
    '-h': '--help',
    '-p': '--page',
    '-v': '--version'
};
/**
 * Current working directory
 */
var CWD = process.cwd();
/**
 * Command line help
 */
var HELP = "ORDBOK Cache Manifest v" + __1.Internals.getVersion() + "\n\nCreates a cache manifest out of a target folder for the HTML5 offline mode.\n\nordbok-cache-manifest [options] <target>\n\nOptions:\n  -a --all          Covers all files instead of cached/loaded ones only\n  -h --help         This help information\n  -p --page <file>  Fallback page when offline\n  -v --version      Version";
/* *
 *
 *  Functions
 *
 * */
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
            console.log(__1.Internals.getVersion());
            return;
        }
        var argv = ARGV.slice();
        var all = false;
        var allIndex = argv.indexOf('--mode');
        if (allIndex > -1) {
            argv.slice(allIndex, allIndex + 1);
            all = true;
        }
        var pageFile = void 0;
        var pageIndex = argv.indexOf('--page');
        if (pageIndex > -1) {
            pageFile = argv.slice(pageIndex, pageIndex + 2)[1];
        }
        if (argv.length !== 1) {
            throw new Error('Invalid arguments');
        }
        var targetFolder = argv.pop();
        if (!targetFolder || targetFolder[0] === '-') {
            throw new Error('Invalid arguments');
        }
        console.log('\nCreate cache manifest...\n');
        cacheManifest(Path.join(CWD, targetFolder), pageFile, all);
        console.log('\nCreated cache manifest\n');
    }
    catch (catchedError) {
        error(catchedError);
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
 *
 * @param targetFolder
 *        Target folder
 * @param pageFile
 * @param addAll
 */
function cacheManifest(targetFolder, pageFile, addAll) {
    if (addAll === void 0) { addAll = false; }
    var files = __1.Internals.getFiles(targetFolder);
    var manifest = ['CACHE MANIFEST'];
    // cache
    manifest.push.apply(manifest, ['CACHE:'].concat(files));
    // fallback
    if (pageFile && !files.includes(pageFile)) {
        console.error('\nWarning: ' + pageFile + ' not found in ' + targetFolder);
    }
    manifest.push('FALLBACK:', '/ ' + pageFile);
    // network
    manifest.push('NETWORK:', '*');
    // create file
    __1.Internals.writeFile(Path.join(targetFolder, 'cache.manifest'), manifest.join('\n'));
}
/* *
 *
 *  Runtime
 *
 * */
cli();
