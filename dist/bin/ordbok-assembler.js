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
var ARGV = process.argv.slice(2).map(mapArgv);
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
 * ORDBOK package configuration
 */
var PACKAGE = require('../../package.json');
/**
 * Command line help
 */
var HELP = "ORDBOK v" + (PACKAGE.version || '0.0.0') + "\n\nCreates dictionary files out of Markdown files.\n\nordbok-assembler [options] source target\n\nOptions:\n  -h --help     This help information\n  -v --version  Version";
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
        __1.Internals.assembleFiles(sourceDirectory, targetDirectory, __1.Internals.getConfig(Path.join(CWD, 'ordbok.json'), DEFAULT_CONFIG));
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
