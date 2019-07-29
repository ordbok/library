#!/usr/bin/env node
/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

/** @internal */

import * as Path from 'path';
import { IConfig, Internals } from '../';

/* *
 *
 *  Constants
 *
 * */

/**
 * Command line arguments
 */
const ARGV = process.argv.slice(2).map(mapArgv);

/**
 * Default core plugin path
 */
const CORE_PLUGIN = Path.join(__dirname, '..');

/**
 * Current working directory
 */
const CWD = process.cwd();

/**
 * Default configuration
 */
const DEFAULT_CONFIG: IConfig = {
    plugins: [CORE_PLUGIN]
};

/**
 * ORDBOK package configuration
 */
const PACKAGE = require('../../package.json');

/**
 * Command line help
 */
const HELP =
`ORDBOK v${PACKAGE.version || '0.0.0'}

Creates dictionary files out of Markdown files.

ordbok-assembler [options] source target

Options:
  -h --help     This help information
  -v --version  Version`;

/* *
 *
 *  Functions
 *
 * */

/**
 * Command line interface
 */
function cli () {

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

        let sourceDirectory = ARGV[ARGV.length - 2];
        let targetDirectory = ARGV[ARGV.length - 1];

        if (sourceDirectory[0] === '-' ||
            targetDirectory[1] === '-'
        ) {
            throw new Error('Invalid arguments');
        }

        Internals.assembleFiles(
            sourceDirectory,
            targetDirectory,
            Internals.getConfig(Path.join(CWD, 'ordbok.json'), DEFAULT_CONFIG)
        );
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
function error (error: Error) {
    console.error('\nError: ' + error.message + '\n');
}

/**
 * Maps shortcuts of command line arguments
 *
 * @param arg
 *        Argument to map
 */
function mapArgv (arg: string): string {

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
