/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

import * as Assert from 'assert';
import * as ChildProcess from 'child_process';
import * as Fs from 'fs';
import * as Path from 'path';
import
{
    Internals
}
from '../lib/internals';
import
{
    cleanTemporaryFolder,
    CONFIG_TEMPLATE,
    MARKDOWN_TEMPLATE,
    TEMPORARY_FOLDER
}
from './index';

/* *
 *
 *  Functions
 *
 * */

export function test (): void
{
    test_cli();
}

function test_cli (): void
{
    Internals.writeFile(Path.join(TEMPORARY_FOLDER, 'ordbok.json'), CONFIG_TEMPLATE);
    Internals.writeFile(Path.join(TEMPORARY_FOLDER, 'translation.md'), MARKDOWN_TEMPLATE);

    const stdout = ChildProcess.execSync(
        'cd "' + TEMPORARY_FOLDER + '" && ../../bin/ordbok-assembler.js . cli'
    );

    Assert.strictEqual(
        Fs.existsSync(Path.join(TEMPORARY_FOLDER, 'cli', 'translation-0.txt')),
        true,
        stdout.toString()
    );

    cleanTemporaryFolder();
}
