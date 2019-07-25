/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

import * as Assert from 'assert';
import * as Fs from 'fs';
import { Internals } from '../dist';

/* *
 *
 *  Functions
 *
 * */

export function test (): void {

    test_writeFile();
}

function test_writeFile (): void {

    Internals.writeFile('_/_.txt', '');

    Assert.ok(Fs.existsSync('_/_.txt'));

    Fs.unlinkSync('_/_.txt')
    Fs.rmdirSync('_');
}
