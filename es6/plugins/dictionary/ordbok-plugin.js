import { Dictionary } from '../../lib';
import { Internals } from '../../lib/internals';
var DictionaryPlugin = (function () {
    function DictionaryPlugin() {
    }
    DictionaryPlugin.prototype.onWriteFile = function (targetFile, markdownPage) {
        Internals.writeFile((targetFile + Dictionary.FILE_EXTENSION), Dictionary.stringify(markdownPage));
    };
    return DictionaryPlugin;
}());
export { DictionaryPlugin };
export var ordbokPlugin = new DictionaryPlugin();
