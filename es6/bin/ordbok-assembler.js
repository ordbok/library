#!/usr/bin/env node
import * as Path from 'path';
import { Internals } from '../internals';
var ARGV_MAP = {
    '-h': '--help',
    '-v': '--version'
};
var ARGV = process.argv.slice(2).map(function (argv) { return ARGV_MAP[argv] || argv; });
var CORE_PLUGIN = Path.join(__dirname, '..');
var CWD = process.cwd();
var DEFAULT_CONFIG = {
    plugins: [CORE_PLUGIN]
};
var HELP = "ORDBOK Assembler v" + Internals.getVersion() + "\n\nCreates dictionary files out of Markdown files.\n\nordbok-assembler [options] <source> <target>\n\nOptions:\n  -h --help     This help information\n  -v --version  Version";
function cli() {
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
        var sourceFolder = ARGV[ARGV.length - 2];
        var targetFolder = ARGV[ARGV.length - 1];
        if (sourceFolder[0] === '-' ||
            targetFolder[0] === '-') {
            throw new Error('Invalid arguments');
        }
        var assembledCounter = Internals
            .assembleFiles(sourceFolder, targetFolder, Internals.getConfig(Path.join(CWD, 'ordbok.json'), DEFAULT_CONFIG));
        console.log('\nAssembled ' + assembledCounter + ' files\n');
    }
    catch (catchedError) {
        error(catchedError);
    }
}
function error(error) {
    console.error('\nError: ' + error.message + '\n');
}
cli();
