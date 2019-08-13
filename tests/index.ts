/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

import * as ChildProcess from 'child_process';
import * as Internals from './internals';
import * as OrdbokAssembler from './ordbok-assembler';

/* *
 *
 *  Constants
 *
 * */

export const CONFIG_TEMPLATE =
`{
    "plugins": [
        "../../dist"
    ]
}`;

export const MARKDOWN_TEMPLATE =
`English
=======

Translation: English ; the English

Grammar:     Noun ; Neuter

New Norwegian
=============

Translation: engelsk ; engelsken

Grammar:     Noun ; Masculine`;

export const TEMPORARY_FOLDER = '_tmp';

/* *
 *
 *  Functions
 *
 * */

export function cleanTemporaryFolder (): void
{
    ChildProcess.execSync(`rm -r "${TEMPORARY_FOLDER}"`);
}

function test (): void
{
    try
    {
        OrdbokAssembler.test();
        Internals.test();

        console.log('Tests succeeded.');

        process.exit(0);
    }
    catch (catchedError)
    {
        console.error('Tests failed!', (catchedError || new Error('unknown')));

        process.exit(1);
    }
}

/* *
 *
 *  Runtime
 *
 * */

test();
