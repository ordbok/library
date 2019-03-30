ORDBOK Core
===========

Core system to create a dictionary out of Markdown files.



How to use
----------

The following example shows a Markdown source file named `english.md`:
```md
English
=======

Word: English

Grammar: noun

Norwegian
=========

Word: engelsk

Grammar: noun
```

The following example takes a Markdown source folder to build dictionary files into a
`./build/dictionary` folder:
```sh
$ npx ordbok-assembler ./markdown ./build/dictionary
```

The following TypeScript code uses the dictionary files to find a translation:
```ts
import { Dictionary } from `ordbok`;

const myDictionary = new Dictionary('build/dictionary');

const theEntry = myDictionary.loadEntry('English');

console.log(theEntry.getSection('Norwegian').word); // = engelsk
console.log(theEntry.getSection('Norwegian').grammar); // = noun
```



Plugins
-------

Create a `ordbok.json` in your project to register custom plugins for the assembling process:
```json
{
    "plugins": [
        "ordbok-index",         // npm
        "./tools/custom-plugin" // folder
    ]
}
```


If you like to create a custom plugin yourself, create a folder or package with a `ordbok-plugin.js`
file somewhere inside. Here is how the corresponding TypeScript file looks like:
```ts
const { IPlugin, IMarkdownPage, Markdown } = require('@ordbok/core');

export const ordbokPlugin: IPlugin = {
    onAssembling: (sourceFolder: string, targetFolder: string) => {},
    onReadFile: (sourceFile: string, markdown: Markdown) => {},
    onWriteFile: (targetFile: string, markdownPage: IMarkdownPage) => {},
    onAssembled: () => {}
};
```
