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
    test_assembleFiles();
}

function test_assembleFiles (): void {

    Internals.writeFile('internals/assembleFiles.json', CONFIG_TEMPLATE);
    Internals.writeFile('internals/assembleFiles.md', MARKDOWN_TEMPLATE);
    Internals.assembleFiles(
        'internals',
        'internals/assembleFiles',
        Internals.getConfig('internals/assembleFiles.json', { plugins: [] })
    );

    Assert.ok(Fs.existsSync('internals/assembleFiles/assembleFiles-0.txt'));

    Fs.unlinkSync('internals/assembleFiles/assembleFiles-0.txt')
    Fs.unlinkSync('internals/assembleFiles.json')
    Fs.unlinkSync('internals/assembleFiles.md')
    Fs.rmdirSync('internals/assembleFiles');
    Fs.rmdirSync('internals');
}

function test_getConfig (): void {

    Internals.writeFile('internals/getConfig.json', CONFIG_TEMPLATE);

    let config: IConfig = { plugins: [] };

    config = Internals.getConfig('internals/getConfig.fail', config);

    Assert.ok(config.plugins instanceof Array);
    Assert.equal(config.plugins.length, 0);

    config = Internals.getConfig('internals/getConfig.json', config);

    Assert.ok(config.plugins instanceof Array);
    Assert.equal(config.plugins.length, 1);

    Fs.unlinkSync('internals/getConfig.json')
    Fs.rmdirSync('internals');
}

function test_writeFile (): void {

    Internals.writeFile('internals/writeFile.txt', '');

    Assert.ok(Fs.existsSync('internals/writeFile.txt'));

    Fs.unlinkSync('internals/writeFile.txt')
    Fs.rmdirSync('internals');
}
