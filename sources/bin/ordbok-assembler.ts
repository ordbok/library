#!/usr/bin/env node
/**
 * @internal
 * @license MIT
 * @author Sophie Bremer
 */

import * as FS from 'fs';
import * as Ordbok from '../lib/index';
import * as Path from 'path';

/* *
 *
 *  Interfaces
 *
 * */

/**
 * Ordbok configuration
 */
interface IConfig {
    plugins: Array<string>;
}

/* *
 *
 *  Constants
 *
 * */

/**
 * Command line arguments
 */
const ARGV = process.argv.slice(2).map(mapArgv);

/**
 * Default plugin path
 */
const PLUGIN = Path.join(__dirname, '..');

/**
 * Ordbok package configuration
 */
const PACKAGE = require('../../package.json');

/**
 * Command line help
 */
const HELP =
`Ordbok v${PACKAGE.version || '0.0.0'}

ordbok-assembler [options] source target

Options:
  -h --help     This help information
  -v --version  Version`;

/* *
 *
 *  Variables
 *
 * */

/**
 * Loaded configuration
 */
let _config: IConfig = {
    plugins: [PLUGIN]
};

/* *
 *
 *  Functions
 *
 * */

/**
 * Assembles markdown files with the help of plugins
 *
 * @param sourceFolder
 *        Source folder
 *
 * @param targetFolder
 *        Target folder
 */
function assemble (sourceFolder: string, targetFolder: string) {

    const plugins: Array<Ordbok.IPlugin> = [];

    _config.plugins.forEach(pluginPath =>
        getFiles(pluginPath, /(?:^|\/)ordbok-plugin\.js$/).forEach(pluginFile =>
            plugins.push(require(pluginFile).ordbokPlugin)
        )
    );

    if (plugins.length === 0) {
        return;
    }

    plugins.forEach(plugin =>
        plugin.onAssembling(sourceFolder, targetFolder)
    );

    getFiles(sourceFolder, /\.(?:md|markdown)$/).forEach(sourceFile => {

        const markdown = new Ordbok.Markdown(
            FS.readFileSync(sourceFile).toString()
        );

        plugins.forEach(plugin => plugin.onReadFile(sourceFile, markdown));

        markdown.pages.forEach((markdownPage, index) => {

            const targetFile = Path.join(
                targetFolder,
                (Ordbok.Utilities.getBaseName(sourceFile) + '-' + index)
            );

            plugins.forEach(plugin =>
                plugin.onWriteFile(targetFile, markdownPage)
            );
        });
    });

    plugins.forEach(plugin =>
        plugin.onAssembled()
    );
}

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
            console.log(PACKAGE.version);
            return;
        }

        if (ARGV.length < 2) {
            throw new Error('Invalid arguments');
        }

        let sourceDirectory = ARGV[ARGV.length - 2];
        let targetDirectory = ARGV[ARGV.length - 1];

        if (sourceDirectory[0] === '-' ||
            targetDirectory[1] === '-'
        ) {
            throw new Error('Invalid arguments');
        }

        config('ordbok.json');
        assemble(sourceDirectory, targetDirectory);
    }
    catch (catchedError) {

        error(catchedError);
    }
}

/**
 * Loads Ordbok configuration from the current working folder
 *
 * @param configPath
 *        Configuration path
 */
function config (configPath: string) {

    if (!FS.existsSync(configPath)) {
        return;
    }

    const configFolder = Path.dirname(configPath);

    _config = JSON.parse(FS.readFileSync('ordbok.json').toString()) as IConfig;

    if (!_config.plugins ||
        _config.plugins.length === 0
    ) {
        _config.plugins = [PLUGIN];
    }
    else {
        _config.plugins = _config.plugins
            .map(pluginPath => (
                pluginPath[0] === '.' ?
                    Path.join(configFolder, pluginPath) :
                    pluginPath
            ));
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
 * Returns all files in a given folder and subfolders.
 *
 * @param sourceFolder
 *        Source folder
 *
 * @param pattern
 *        Pattern
 */
function getFiles (sourceFolder: string, pattern?: RegExp): Array<string> {

    const files = [] as Array<string>;

    if (!FS.existsSync(sourceFolder)) {
        return files;
    }

    FS
        .readdirSync(sourceFolder, { withFileTypes: true })
        .forEach(sourceEntry => {

            const path = Path.join(sourceFolder, sourceEntry.name);

            if (sourceEntry.isDirectory()) {
                files.push(...getFiles(path, pattern));
            }
            if (sourceEntry.isFile() &&
                (!pattern || pattern.test(path))
            ) {
                files.push(path);
            }
        });

    return files;
}

/**
 * Maps shortcuts of command line arguments
 *
 * @param arg
 *        Argument to map
 */
function mapArgv (arg: string): string {

    switch (arg) {
        default:
            return arg;
        case '-h':
            return '--help';
        case '-v':
            return '--version';
    }
}

/* *
 *
 *  Runtime
 *
 * */

cli();