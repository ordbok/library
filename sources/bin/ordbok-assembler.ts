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
 * Command line arguments shortcuts
 */
const ARGV_MAP: Record<string, string> = {
    '-h': '--help',
    '-v': '--version'
};

/**
 * Command line arguments
 */
const ARGV = process.argv.slice(2).map(argv => ARGV_MAP[argv] || argv);

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
 * Command line help
 */
const HELP =
`ORDBOK Assembler v${Internals.getVersion()}

Creates dictionary files out of Markdown files.

ordbok-assembler [options] <source> <target>

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
            console.log(Internals.getVersion());
            return;
        }

        if (ARGV.length < 2) {
            throw new Error('Invalid arguments');
        }

        let sourceFolder = ARGV[ARGV.length - 2];
        let targetFolder = ARGV[ARGV.length - 1];

        if (sourceFolder[0] === '-' ||
            targetFolder[0] === '-'
        ) {
            throw new Error('Invalid arguments');
        }

        const assembledCounter = Internals
            .assembleFiles(
                sourceFolder,
                targetFolder,
                Internals.getConfig(Path.join(CWD, 'ordbok.json'), DEFAULT_CONFIG)
            );

        console.log('\nAssembled ' + assembledCounter + ' files\n')
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

/* *
 *
 *  Runtime
 *
 * */

cli();
