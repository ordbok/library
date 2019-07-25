/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

import * as Internals from './internals';

/* *
 *
 *  Functions
 *
 * */

export function test (): void {

    try {

        Internals.test();

        console.log('Tests succeeded.');

        process.exit(0);
    }
    catch (catchedError) {

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
