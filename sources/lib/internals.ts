/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/

/** @internal */

import * as FS from 'fs';
import * as Path from 'path';
import { Dictionary, IMarkdownPage, Markdown, Utilities } from '.';

/* *
 *
 *  Interfaces
 *
 * */

/**
 * ORDBOK configuration
 */
export interface IConfig {
    plugins: Array<string>;
}

/**
 * Interface of an `ordbokPlugin` export
 */
export interface IPlugin {

    /* *
     *
     *  Events
     *
     * */

    /**
     * Called after assembling.
     */
    onAssembled? (): void;

    /**
     * Called before assembling.
     *
     * @param sourceFolder
     *        Source folder
     *
     * @param targetFolder
     *        Target folder
     */
    onAssembling? (sourceFolder: string, targetFolder: string): void;

    /**
     * Called after reading a markdown file.
     *
     * @param sourceFile
     *        Source file
     *
     * @param markdown
     *        File's markdown
     */
    onReadFile? (sourceFile: string, markdown: Markdown): void;

    /**
     * Called before writing a dictionary entry.
     *
     * @param targetFile
     *        Target file
     *
     * @param markdownPage
     *        File's markdown
     */
    onWriteFile? (targetFile: string, markdownPage: IMarkdownPage): void;
}

/* *
 *
 *  Module
 *
 * */

/**
 * Internal utilities
 */
export module Internals {

    /* *
     *
     *  Constants
     *
     * */

    /**
     * ORDBOK package configuration
     */
    const PACKAGE = require('../package.json');

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Processes Markdown files with the help of plugins and returns the number
     * of assembled files.
     *
     * @param sourceFolder
     *        Source folder
     *
     * @param targetFolder
     *        Target folder
     *
     * @param config
     *        Assembling configuration
     */
    export function assembleFiles (
        sourceFolder: string,
        targetFolder: string,
        config: IConfig
    ): number {

        const plugins: Array<IPlugin> = [];

        config.plugins.forEach(pluginPath =>
            getFiles(pluginPath, /(?:^|\/)ordbok-plugin\.js$/).forEach(pluginFile =>
                plugins.push(require(pluginFile).ordbokPlugin)
            )
        );

        if (plugins.length === 0) {
            console.log(config, plugins);
            return 0;
        }

        plugins.forEach(plugin =>
            plugin.onAssembling &&
            plugin.onAssembling(sourceFolder, targetFolder)
        );

        let assembledCounter: number = 0;

        getFiles(sourceFolder, /\.(?:md|markdown)$/).forEach(function (sourceFile): void {

            const markdown = new Markdown(
                FS.readFileSync(sourceFile).toString()
            );

            plugins.forEach(plugin =>
                plugin.onReadFile &&
                plugin.onReadFile(sourceFile, markdown)
            );

            markdown.pages.forEach(function (markdownPage, pageIndex): void {

                plugins.forEach(plugin =>
                    plugin.onWriteFile &&
                    plugin.onWriteFile(
                        Path.join(
                            targetFolder,
                            (
                                Utilities.getBaseName(sourceFile) +
                                Dictionary.FILE_SEPARATOR +
                                pageIndex
                            )
                        ),
                        markdownPage
                    )
                )

                ++assembledCounter;

            });
        });

        plugins.forEach(plugin =>
            plugin.onAssembled &&
            plugin.onAssembled()
        );

        return assembledCounter;
    }

    /**
     * Loads the configuration from the current working folder
     *
     * @param configPath
     *        Configuration path
     */
    export function getConfig (configPath: string, defaultConfig: IConfig): IConfig {

        if (!FS.existsSync(configPath)) {
            return defaultConfig;
        }

        const configFolder = Path.dirname(configPath);
        const config = JSON.parse(FS.readFileSync(configPath).toString()) as IConfig;

        if (
            !config.plugins ||
            config.plugins.length === 0
        ) {
            config.plugins = defaultConfig.plugins;
        }
        else {
            config.plugins = config.plugins.map(pluginPath =>
                pluginPath[0] !== Path.sep ?
                    Path.join(configFolder, pluginPath) :
                    pluginPath
            );
        }

        return config;
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
    export function getFiles (sourceFolder: string, pattern?: RegExp): Array<string> {

        const files = [] as Array<string>;

        if (!FS.existsSync(sourceFolder)) {
            return files;
        }

        FS
            .readdirSync(sourceFolder, { withFileTypes: true })
            .forEach(function (sourceEntry: FS.Dirent): void {

                const path = Path.join(sourceFolder, sourceEntry.name);

                if (sourceEntry.isDirectory()) {
                    files.push(...getFiles(path, pattern));
                }
                else if (
                    sourceEntry.isFile() &&
                    (!pattern || pattern.test(path))
                ) {
                    files.push(path);
                }
            });

        return files;
    }

    /**
     * Returns the version of the ORDBOK core.
     */
    export function getVersion (): string {

        return (PACKAGE.version || '0.0.0');
    }

    /**
     * Creates all necessary folders for a given file path.
     *
     * @param filePath
     *        File path to establish
     */
    export function makeFilePath (filePath: string) {

        let currentPath = '';

        Path
            .normalize(Path.dirname(filePath))
            .split(Path.sep)
            .map((entry, index) =>
                currentPath += (index ? Path.sep : '') + entry
            )
            .forEach(path =>
                !FS.existsSync(path) ?
                    FS.mkdirSync(path) :
                    undefined
            );
    }

    /**
     * Creates a file with the given path. Creates all necessary folders.
     *
     * @param filePath
     *        File path to establish
     *
     * @param fileContent
     *        File content to write
     *
     * @param options
     *        Write options
     */
    export function writeFile (
        filePath: string,
        fileContent: string,
        options?: FS.WriteFileOptions
    ) {

        makeFilePath(filePath);

        FS.writeFileSync(filePath, fileContent, options);
    }
}
