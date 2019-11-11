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
 * Command line arguments shortcuts
 */
var ARGV_MAP = {
    '-h': '--help',
    '-v': '--version'
};
/**
 * Command line arguments
 */
var ARGV = process.argv.slice(2).map(function (argv) { return ARGV_MAP[argv] || argv; });
/**
 * Default core plugin path
 */
var CORE_PLUGIN = Path.join(__dirname, '..');
/**
 * Current working directory
 */
var CWD = process.cwd();
/**
 * Default configuration
 */
var DEFAULT_CONFIG = {
    plugins: [CORE_PLUGIN]
};
/**
 * Command line help
 */
var HELP = "ORDBOK Assembler v" + __1.Internals.getVersion() + "\n\nCreates dictionary files out of Markdown files.\n\nordbok-assembler [options] <source> <target>\n\nOptions:\n  -h --help     This help information\n  -v --version  Version";
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
        if (ARGV.length < 2) {
            throw new Error('Invalid arguments');
        }
        var sourceFolder = ARGV[ARGV.length - 2];
        var targetFolder = ARGV[ARGV.length - 1];
        if (sourceFolder[0] === '-' ||
            targetFolder[0] === '-') {
            throw new Error('Invalid arguments');
        }
        var assembledCounter = __1.Internals
            .assembleFiles(sourceFolder, targetFolder, __1.Internals.getConfig(Path.join(CWD, 'ordbok.json'), DEFAULT_CONFIG));
        console.log('\nAssembled ' + assembledCounter + ' files\n');
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
/* *
 *
 *  Runtime
 *
 * */
cli();
