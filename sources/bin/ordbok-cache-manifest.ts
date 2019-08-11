#!/usr/bin/env node
/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

/** @internal */

import * as Path from 'path';
import { Internals } from '../';

/* *
 *
 *  Constants
 *
 * */

/**
 * Command line arguments
 */
const ARGV = process.argv.slice(2).map(argv => ARGV_MAP[argv] || argv);

/**
 * Command line arguments shortcuts
 */
const ARGV_MAP: Record<string, string> = {
    '-a': '--all',
    '-h': '--help',
    '-p': '--page',
    '-v': '--version'
};

/**
 * Current working directory
 */
const CWD = process.cwd();

/**
 * Command line help
 */
const HELP =
`ORDBOK Cache Manifest v${Internals.getVersion()}

Creates a cache manifest out of a target folder for the HTML5 offline mode.

ordbok-cache-manifest [options] <target>

Options:
  -a --all          Covers all files instead of cached/loaded ones only
  -h --help         This help information
  -p --page <file>  Fallback page when offline
  -v --version      Version`;

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

        const argv = ARGV.slice();

        let all = false;
        let allIndex = argv.indexOf('--mode');

        if (allIndex > -1) {
            argv.slice(allIndex, allIndex + 1);
            all = true;
        }

        let pageFile: (string|undefined);
        let pageIndex = argv.indexOf('--page');

        if (pageIndex > -1) {
            pageFile = argv.slice(pageIndex, pageIndex + 2)[1];
        }

        if (argv.length !== 1) {
            throw new Error('Invalid arguments');
        }

        let targetFolder = argv.pop();

        if (!targetFolder || targetFolder[0] === '-') {
            throw new Error('Invalid arguments');
        }

        console.log('\nCreate cache manifest...\n')

        cacheManifest(Path.join(CWD, targetFolder), pageFile, all);

        console.log('\nCreated cache manifest\n')
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
 *
 * @param targetFolder
 *        Target folder
 * @param pageFile
 * @param addAll
 */
function cacheManifest (targetFolder: string, pageFile?: string, addAll: boolean = false) {

    const files = Internals.getFiles(targetFolder);
    const manifest: Array<string> = ['CACHE MANIFEST'];

    // cache

    manifest.push('CACHE:', ...files);

    // fallback

    if (pageFile && !files.includes(pageFile)) {
        console.error('\nWarning: ' + pageFile + ' not found in ' + targetFolder);
    }

    manifest.push('FALLBACK:', '/ ' + pageFile);

    // network

    manifest.push('NETWORK:', '*');

    // create file

    Internals.writeFile(
        Path.join(targetFolder, 'cache.manifest'),
        manifest.join('\n')
    )
}

/* *
 *
 *  Runtime
 *
 * */

cli();
