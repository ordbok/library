/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

import { strict as Assert } from 'assert';
import * as Fs from 'fs';
import { IConfig, Internals } from '../dist';
import { CONFIG_TEMPLATE, MARKDOWN_TEMPLATE } from './index';

/* *
 *
 *  Functions
 *
 * */

export function test (): void {

    test_writeFile();
    test_getConfig();
    test_getFiles();
    test_assembleFiles();
}

function test_assembleFiles (): void {

    Internals.writeFile('assembleFiles.json', CONFIG_TEMPLATE);
    Internals.writeFile('assembleFiles.md', MARKDOWN_TEMPLATE);
    Internals.assembleFiles(
        '.',
        'assembleFiles',
        Internals.getConfig('assembleFiles.json', { plugins: [] })
    );

    Assert.ok(Fs.existsSync('assembleFiles/assembleFiles-0.txt'));

    Fs.unlinkSync('assembleFiles/assembleFiles-0.txt')
    Fs.unlinkSync('assembleFiles.json')
    Fs.unlinkSync('assembleFiles.md')
    Fs.rmdirSync('assembleFiles');
}

function test_getConfig (): void {

    Internals.writeFile('getConfig.json', CONFIG_TEMPLATE);

    let config: IConfig = { plugins: [] };

    config = Internals.getConfig('getConfig.fail', config);
    Assert.ok(config.plugins instanceof Array);
    Assert.equal(config.plugins.length, 0);

    config = Internals.getConfig('getConfig.json', config);
    Assert.ok(config.plugins instanceof Array);
    Assert.deepEqual(config, JSON.parse(CONFIG_TEMPLATE));

    Fs.unlinkSync('getConfig.json')
}

function test_getFiles (): void {

    Internals.writeFile('getFiles.markdown', CONFIG_TEMPLATE);

    const files = Internals.getFiles('.', /\.markdown$/);

    Assert.deepEqual(files, ['getFiles.markdown']);

    Fs.unlinkSync('getFiles.markdown')
}

function test_writeFile (): void {

    Internals.writeFile('writeFile.txt', '');

    Assert.ok(Fs.existsSync('writeFile.txt'));

    Fs.unlinkSync('writeFile.txt')
}
