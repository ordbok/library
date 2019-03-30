/**
 * @license MIT
 * @author Sophie Bremer
 */

import * as FS from 'fs';
import { IMarkdownPage, IMarkdownSection } from '../lib/index';
import { IPlugin } from '../plugin';

/* *
 *
 *  Classes
 *
 * */

/**
 * Default plugin to create dictionary text files.
 */
export class TextPlugin implements IPlugin {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Converts a Markdown page into a dictionary text.
     *
     * @param markdownPage
     *        Markdown page
     */
    public static stringify(markdownPage: IMarkdownPage): string {

        const resultLines = [] as Array<string>;

        let section: IMarkdownSection;

        Object
            .keys(markdownPage)
            .forEach(headline => {

                resultLines.push(headline)

                section = markdownPage[headline];

                Object
                    .keys(section)
                    .forEach(category =>
                        resultLines.push(category + ':' + section[category].join(','))
                    );
            });

        return resultLines.join('\n');
    }

    /* *
     *
     *  Constructors
     *
     * */

    /**
     * Creates a plugin instance.
     */
    public constructor () {

        this._sourceFolder = '';
        this._targetFolder = '';
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Markdown folder
     */
    private _sourceFolder: string;

    /**
     * Dictionary folder
     */
    private _targetFolder: string;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Gets called after the assembling has been done.
     */
    public onAssembled () {

        // nothing to do
    }

    /**
     * Gets called before the assembling begins.
     *
     * @param sourceFolder
     *        Markdown folder
     *
     * @param targetFolder
     *        Dictionary folder
     */
    public onAssembling (sourceFolder: string, targetFolder: string) {

        this._sourceFolder = sourceFolder;
        this._targetFolder = targetFolder;
    }

    /**
     * Gets called after a markdown file has been read.
     */
    public onReadFile () {

        // nothing to do
    }

    /**
     * Gets called before a dictionary file will be written.
     *
     * @param targetFile
     *        Dictionary file path
     *
     * @param markdownPage
     *        Logical file content
     */
    public onWriteFile (targetFile: string, markdownPage: IMarkdownPage) {

        FS.writeFileSync(targetFile + '.txt', TextPlugin.stringify(markdownPage));
    }
}
