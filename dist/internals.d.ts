/// <reference types="node" />
/** @internal */
import * as FS from 'fs';
import { IMarkdownPage, Markdown } from './lib';
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
    /**
     * Called after assembling.
     */
    onAssembled?(): void;
    /**
     * Called before assembling.
     *
     * @param sourceFolder
     *        Source folder
     *
     * @param targetFolder
     *        Target folder
     */
    onAssembling?(sourceFolder: string, targetFolder: string): void;
    /**
     * Called after reading a markdown file.
     *
     * @param sourceFile
     *        Source file
     *
     * @param markdown
     *        File's markdown
     */
    onReadFile?(sourceFile: string, markdown: Markdown): void;
    /**
     * Called before writing a dictionary entry.
     *
     * @param targetFile
     *        Target file
     *
     * @param markdownPage
     *        File's markdown
     */
    onWriteFile?(targetFile: string, markdownPage: IMarkdownPage): void;
}
/**
 * Internal utilities
 */
export declare module Internals {
    /**
     * Assembles markdown files with the help of plugins
     *
     * @param sourceFolder
     *        Source folder
     *
     * @param targetFolder
     *        Target folder
     */
    function assembleFiles(sourceFolder: string, targetFolder: string, config: IConfig): void;
    /**
     * Loads the configuration from the current working folder
     *
     * @param configPath
     *        Configuration path
     */
    function getConfig(configPath: string, defaultConfig: IConfig): IConfig;
    /**
     * Returns all files in a given folder and subfolders.
     *
     * @param sourceFolder
     *        Source folder
     *
     * @param pattern
     *        Pattern
     */
    function getFiles(sourceFolder: string, pattern?: RegExp): Array<string>;
    /**
     * Creates all necessary folders for a given file path.
     *
     * @param filePath
     *        File path to establish
     */
    function makeFilePath(filePath: string): void;
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
    function writeFile(filePath: string, fileContent: string, options?: FS.WriteFileOptions): void;
}
