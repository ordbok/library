/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

import * as Assert from 'assert';
import * as Fs from 'fs';
import * as Path from 'path';
import
{
    IConfig,
    Internals
}
from '../dist';
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
    test_writeFile();
    test_getFiles();
    test_getConfig();
    test_assembleFiles();
}

function test_assembleFiles (): void
{
    Internals.writeFile(Path.join(TEMPORARY_FOLDER, 'assembleFiles.json'), CONFIG_TEMPLATE);
    Internals.writeFile(Path.join(TEMPORARY_FOLDER, 'assembleFiles.md'), MARKDOWN_TEMPLATE);
    const assembledCounter = Internals
        .assembleFiles(
            TEMPORARY_FOLDER,
            Path.join(TEMPORARY_FOLDER, 'assembledFiles'),
            Internals.getConfig(Path.join(TEMPORARY_FOLDER, 'assembleFiles.json'), { plugins: [] })
        );

    Assert.ok(Fs.existsSync(Path.join(TEMPORARY_FOLDER, 'assembledFiles', 'assembleFiles-0.txt')));
    Assert.strictEqual(assembledCounter, 1);

    cleanTemporaryFolder();
}

function test_getConfig (): void
{
    Internals.writeFile(Path.join(TEMPORARY_FOLDER, 'getConfig.json'), CONFIG_TEMPLATE);

    let config: IConfig = { plugins: [] };

    config = Internals.getConfig(Path.join(TEMPORARY_FOLDER, 'getConfig.fail'), config);
    Assert.ok(config.plugins instanceof Array);
    Assert.strictEqual(config.plugins.length, 0);

    config = Internals.getConfig(Path.join(TEMPORARY_FOLDER, 'getConfig.json'), config);
    Assert.ok(config.plugins instanceof Array);
    Assert.deepStrictEqual(config, { plugins: ['../dist'] });

    cleanTemporaryFolder();
}

function test_getFiles (): void
{
    Internals.writeFile(Path.join(TEMPORARY_FOLDER, 'getFiles.markdown'), CONFIG_TEMPLATE);

    const files = Internals.getFiles(TEMPORARY_FOLDER, /\.markdown$/);

    Assert.deepStrictEqual(files, [Path.join(TEMPORARY_FOLDER, 'getFiles.markdown')]);

    cleanTemporaryFolder();
}

function test_writeFile (): void
{
    Internals.writeFile(Path.join(TEMPORARY_FOLDER, 'writeFile.txt'), '');

    Assert.ok(Fs.existsSync(Path.join(TEMPORARY_FOLDER, 'writeFile.txt')));

    cleanTemporaryFolder();
}
