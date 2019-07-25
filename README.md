ORDBOK Core
===========

Core system to create a dictionary out of Markdown files.



How to use
----------

The following example shows a Markdown source file named `english.md`:
```md
English
=======

Translation: English, the English

Grammar: Noun, Neuter

New Norwegian
=============

Translation: engelsk, engelsken

Grammar: Noun, Masculine
```

The following example takes a Markdown source folder to build dictionary files
into a `./build/dictionary` folder:
```sh
$ npx ordbok-assembler ./markdown ./build/dictionary
```

The following TypeScript code uses the dictionary files to find a translation:
```ts
import { Dictionary, Utilities } from `@ordbok/core`;

const myDictionary = new Dictionary('build/dictionary');

const theEntry = myDictionary.loadEntry('English');

console.log(theEntry[Utilities.getKey('New Norwegian')].translation); // = engelsk, engelsken
console.log(theEntry[Utilities.getKey('New Norwegian')].grammar); // = Noun, Masculine
```



Plugins
-------

Create a `ordbok.json` in your project to register custom plugins for the
assembling process. You can specify node modules and folders:
```json
{
    "plugins": [
        "@ordbok/index-plugin",
        "./tools/custom-plugin"
    ]
}
```


If you like to create a custom plugin yourself, create a folder or package with
a `ordbok-plugin.js` file somewhere inside. Here is how the corresponding
TypeScript file looks like:
```ts
const { IMarkdownPage, IPlugin, Markdown } = require('@ordbok/core/dist');

export const ordbokPlugin: IPlugin = {
    onAssembling: (sourceFolder: string, targetFolder: string) => {},
    onReadFile: (sourceFile: string, markdown: Markdown) => {},
    onWriteFile: (targetFile: string, markdownPage: IMarkdownPage) => {},
    onAssembled: () => {}
};
```
