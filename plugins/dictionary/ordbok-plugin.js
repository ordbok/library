"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("../../lib");
var internals_1 = require("../../lib/internals");
var DictionaryPlugin = (function () {
    function DictionaryPlugin() {
    }
    DictionaryPlugin.prototype.onWriteFile = function (targetFile, markdownPage) {
        internals_1.Internals.writeFile((targetFile + lib_1.Dictionary.FILE_EXTENSION), lib_1.Dictionary.stringify(markdownPage));
    };
    return DictionaryPlugin;
}());
exports.DictionaryPlugin = DictionaryPlugin;
exports.ordbokPlugin = new DictionaryPlugin();
