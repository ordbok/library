(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ordbokCore = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/*!---------------------------------------------------------------------------*/
/*! Copyright (c) ORDBOK contributors. All rights reserved.                   */
/*! Licensed under the MIT License. See the LICENSE file in the project root. */
/*!---------------------------------------------------------------------------*/
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./ordbok-core/index"));

},{"./ordbok-core/index":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ajax = (function () {
    function Ajax(baseUrl, cacheTimeout, responseTimeout) {
        if (baseUrl === void 0) { baseUrl = ''; }
        if (cacheTimeout === void 0) { cacheTimeout = 3600000; }
        if (responseTimeout === void 0) { responseTimeout = 60000; }
        this._cache = {};
        this._requests = 0;
        this.baseUrl = baseUrl;
        this.cacheTimeout = (cacheTimeout < 0 ? 0 : cacheTimeout);
        this.responseTimeout = (responseTimeout < 0 ? 0 : responseTimeout);
    }
    Ajax.prototype.onError = function (progressEvent) {
        var context = this.context;
        if (!context) {
            return;
        }
        var error = new Error('error');
        error.result = this.response.toString();
        error.serverStatus = this.status;
        error.timestamp = progressEvent.timeStamp;
        error.url = context.url;
        if (context.isCountingRequest) {
            context.isCountingRequest = false;
            context.ajax._requests--;
        }
        context.reject(error);
    };
    Ajax.prototype.onLoad = function (progressEvent) {
        var context = this.context;
        if (!context) {
            return;
        }
        if (context.isCountingRequest) {
            context.isCountingRequest = false;
            context.ajax._requests--;
        }
        context.resolve({
            result: (this.response || '').toString(),
            serverStatus: this.status,
            timestamp: progressEvent.timeStamp,
            url: context.url
        });
    };
    Ajax.prototype.onTimeout = function (progressEvent) {
        var context = this.context;
        if (!context) {
            return;
        }
        var error = new Error('timeout');
        error.result = this.response.toString();
        error.serverStatus = this.status;
        error.timestamp = progressEvent.timeStamp;
        error.url = context.url;
        if (context.isCountingRequest) {
            context.isCountingRequest = false;
            context.ajax._requests--;
        }
        context.reject(error);
    };
    Ajax.prototype.hasOpenRequest = function () {
        if (this._requests < 0) {
            this._requests = 0;
        }
        return (this._requests > 0);
    };
    Ajax.prototype.request = function (urlPath) {
        var ajax = this;
        return new Promise(function (resolve, reject) {
            var url = ajax.baseUrl + urlPath;
            var context = { ajax: ajax, resolve: resolve, reject: reject, url: url };
            if (ajax.cacheTimeout > 0) {
                var cachedResult = ajax._cache[url];
                var cacheTimeout = (new Date()).getTime() + ajax.cacheTimeout;
                if (cachedResult &&
                    cachedResult.timestamp > cacheTimeout) {
                    resolve(cachedResult);
                    return;
                }
                delete ajax._cache[url];
            }
            var server = new XMLHttpRequest();
            server.context = context;
            context.isCountingRequest = false;
            try {
                if (ajax.cacheTimeout <= 0 &&
                    url.indexOf('?') === -1) {
                    server.open('GET', (url + '?' + (new Date()).getTime()), true);
                }
                else {
                    server.open('GET', url, true);
                }
                ajax._requests++;
                context.isCountingRequest = true;
                server.timeout = ajax.responseTimeout;
                server.addEventListener('load', ajax.onLoad);
                server.addEventListener('error', ajax.onError);
                server.addEventListener('timeout', ajax.onTimeout);
                server.send();
            }
            catch (catchedError) {
                var error = catchedError;
                error.result = (server.response || '');
                error.timestamp = (new Date()).getTime();
                error.serverStatus = server.status;
                error.url = context.url;
                if (context.isCountingRequest) {
                    context.isCountingRequest = false;
                    context.ajax._requests--;
                }
                reject(error);
            }
        });
    };
    return Ajax;
}());
exports.Ajax = Ajax;

},{}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ajax_1 = require("./ajax");
var utilities_1 = require("./utilities");
var Dictionary = (function (_super) {
    __extends(Dictionary, _super);
    function Dictionary() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dictionary.parse = function (stringified) {
        var dictionaryPage = {};
        var categorySplit;
        var dictionarySection;
        stringified
            .split(Dictionary.LINE_SEPARATOR)
            .forEach(function (line) {
            if (line.indexOf(Dictionary.PAIR_SEPARATOR) === -1) {
                dictionaryPage[line] = dictionarySection = {};
                return;
            }
            if (!dictionarySection) {
                return;
            }
            categorySplit = line.split(Dictionary.PAIR_SEPARATOR, 2);
            dictionarySection[categorySplit[0]] = (categorySplit[1].split(Dictionary.VALUE_SEPARATOR));
        });
        return dictionaryPage;
    };
    Dictionary.stringify = function (markdownPage) {
        var stringified = [];
        var markdownSection;
        Object
            .keys(markdownPage)
            .forEach(function (headline) {
            stringified.push(utilities_1.Utilities.getKey(headline));
            markdownSection = markdownPage[headline];
            Object
                .keys(markdownSection)
                .forEach(function (category) {
                return stringified.push(utilities_1.Utilities.getKey(category) +
                    Dictionary.PAIR_SEPARATOR +
                    markdownSection[category].join(Dictionary.VALUE_SEPARATOR));
            });
        });
        return stringified.join(Dictionary.LINE_SEPARATOR);
    };
    Dictionary.prototype.loadEntry = function (baseName, pageIndex) {
        if (pageIndex === void 0) { pageIndex = 0; }
        return this
            .request(utilities_1.Utilities.getKey(baseName) +
            Dictionary.FILE_SEPARATOR +
            pageIndex +
            Dictionary.FILE_EXTENSION)
            .then(function (response) {
            if (response instanceof Error ||
                response.serverStatus >= 400) {
                return;
            }
            return Dictionary.parse(response.result);
        })
            .catch(function (error) {
            console.error(error);
            return;
        });
    };
    Dictionary.FILE_EXTENSION = '.txt';
    Dictionary.FILE_SEPARATOR = '-';
    Dictionary.LINE_SEPARATOR = '\n';
    Dictionary.PAIR_SEPARATOR = ':';
    Dictionary.VALUE_SEPARATOR = ';';
    return Dictionary;
}(ajax_1.Ajax));
exports.Dictionary = Dictionary;

},{"./ajax":2,"./utilities":7}],4:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./ajax"));
__export(require("./dictionary"));
__export(require("./markdown"));
__export(require("./str"));
__export(require("./utilities"));

},{"./ajax":2,"./dictionary":3,"./markdown":5,"./str":6,"./utilities":7}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var str_1 = require("./str");
var HEADLINE_REGEXP = /^(?:#+([\s\S]*)|([\s\S]*?)\n(?:={3,}|-{3,}))$/;
var PAIR_REGEXP = /^([^\:\n\r\t\v]+):([\s\S]*)$/;
var PAGE_REGEXP = /(?:^\n?|\n\n)-{3,}(?:\n\n|\n?$)/;
var PARAGRAPH_REGEXP = /\n{2,}/;
var Markdown = (function () {
    function Markdown(markdown) {
        this._pages = [];
        this._raw = markdown;
        this.parse(markdown);
    }
    Markdown.parsePage = function (markdownPage) {
        var page = {};
        var match;
        var section;
        markdownPage
            .split(PARAGRAPH_REGEXP)
            .forEach(function (paragraph) {
            match = HEADLINE_REGEXP.exec(paragraph);
            if (match) {
                page[str_1.Str.trimSpaces(match[1] || match[2])] = section = {};
            }
            if (!section) {
                return;
            }
            match = PAIR_REGEXP.exec(paragraph);
            if (match) {
                section[match[1]] = match[2]
                    .split(';')
                    .map(str_1.Str.trimSpaces);
            }
        });
        return page;
    };
    Object.defineProperty(Markdown.prototype, "pages", {
        get: function () {
            return this._pages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Markdown.prototype, "raw", {
        get: function () {
            return this._raw;
        },
        enumerable: true,
        configurable: true
    });
    Markdown.prototype.parse = function (markdown) {
        var pages = this._pages;
        markdown
            .split(PAGE_REGEXP)
            .forEach(function (page) { return pages.push(Markdown.parsePage(page)); });
    };
    return Markdown;
}());
exports.Markdown = Markdown;

},{"./str":6}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BRACKET_REGEXP = /\([^\)]*\)|\[[^\]]*\]|\{[^\}]*\}/g;
var SPACE_REGEXP = /\s+/g;
var Str = (function (_super) {
    __extends(Str, _super);
    function Str(str) {
        return _super.call(this, str) || this;
    }
    Str.endsWith = function (str, pattern) {
        if (str === pattern) {
            return true;
        }
        var strLength = str.length;
        var patternLength = pattern.length;
        return (patternLength <= strLength &&
            str.lastIndexOf(pattern) === strLength - patternLength);
    };
    Str.removeBrackets = function (str) {
        return str.replace(BRACKET_REGEXP, '').replace(SPACE_REGEXP, ' ').trim();
    };
    Str.trimSpaces = function (str) {
        return str.replace(SPACE_REGEXP, ' ').trim();
    };
    Str.prototype.endsWith = function (pattern) {
        return Str.endsWith(this.toString(), pattern);
    };
    Str.prototype.removeBrackets = function () {
        return new Str(Str.removeBrackets(this.toString()));
    };
    Str.prototype.trimSpaces = function () {
        return new Str(Str.trimSpaces(this.toString()));
    };
    return Str;
}(String));
exports.Str = Str;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NON_CHARACTER_REGEXP = /[^0-9A-Za-z\u0080-\uFFFF -]/g;
var PATH_REGEXP = /^(.*?)([^\.\/]*)([^\/]*)$/;
var SPACE_REGEXP = /\s+/g;
var Utilities;
(function (Utilities) {
    function getExtension(filePath) {
        var match = PATH_REGEXP.exec(filePath);
        return (match && match[3] || '');
    }
    Utilities.getExtension = getExtension;
    function getBaseName(filePath) {
        var match = PATH_REGEXP.exec(filePath);
        return (match && match[2] || '');
    }
    Utilities.getBaseName = getBaseName;
    function getKey(text) {
        return text
            .replace(NON_CHARACTER_REGEXP, ' ')
            .trim()
            .replace(SPACE_REGEXP, '-')
            .toLowerCase();
    }
    Utilities.getKey = getKey;
    function getNorm(text) {
        return text
            .replace(NON_CHARACTER_REGEXP, ' ')
            .trim()
            .replace(SPACE_REGEXP, ' ')
            .toLowerCase();
    }
    Utilities.getNorm = getNorm;
    function getParentPath(path) {
        var match = PATH_REGEXP.exec(path);
        return (match && match[1] || '');
    }
    Utilities.getParentPath = getParentPath;
    function rotate(text) {
        var isDecode = text.indexOf('base64,') === 0;
        if (isDecode) {
            text = atob(text.substr(7));
        }
        var result = [];
        for (var charCode = 0, index = 0, indexEnd = text.length; index < indexEnd; ++index) {
            charCode = text.charCodeAt(index);
            charCode += (charCode < 128 ? 128 : -128);
            result.push(String.fromCharCode(charCode));
        }
        text = result.join('');
        if (!isDecode) {
            text = 'base64,' + btoa(text);
        }
        return text;
    }
    Utilities.rotate = rotate;
    function splat(obj) {
        if (obj instanceof Array) {
            return obj
                .reduce(function (result, value) {
                if (value && typeof value === 'object') {
                    result.push.apply(result, splat(value));
                }
                else {
                    result.push(value);
                }
                return result;
            }, []);
        }
        else {
            return splat(Object.values(obj));
        }
    }
    Utilities.splat = splat;
})(Utilities = exports.Utilities || (exports.Utilities = {}));

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvb3JkYm9rLWNvcmUuanMiLCJsaWIvb3JkYm9rLWNvcmUvYWpheC5qcyIsImxpYi9vcmRib2stY29yZS9kaWN0aW9uYXJ5LmpzIiwibGliL29yZGJvay1jb3JlL2luZGV4LmpzIiwibGliL29yZGJvay1jb3JlL21hcmtkb3duLmpzIiwibGliL29yZGJvay1jb3JlL3N0ci5qcyIsImxpYi9vcmRib2stY29yZS91dGlsaXRpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKiEtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyohIENvcHlyaWdodCAoYykgT1JEQk9LIGNvbnRyaWJ1dG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gICAgICAgICAgICAgICAgICAgKi9cbi8qISBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuIFNlZSB0aGUgTElDRU5TRSBmaWxlIGluIHRoZSBwcm9qZWN0IHJvb3QuICovXG4vKiEtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZnVuY3Rpb24gX19leHBvcnQobSkge1xuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcbn1cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL29yZGJvay1jb3JlL2luZGV4XCIpKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEFqYXggPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFqYXgoYmFzZVVybCwgY2FjaGVUaW1lb3V0LCByZXNwb25zZVRpbWVvdXQpIHtcbiAgICAgICAgaWYgKGJhc2VVcmwgPT09IHZvaWQgMCkgeyBiYXNlVXJsID0gJyc7IH1cbiAgICAgICAgaWYgKGNhY2hlVGltZW91dCA9PT0gdm9pZCAwKSB7IGNhY2hlVGltZW91dCA9IDM2MDAwMDA7IH1cbiAgICAgICAgaWYgKHJlc3BvbnNlVGltZW91dCA9PT0gdm9pZCAwKSB7IHJlc3BvbnNlVGltZW91dCA9IDYwMDAwOyB9XG4gICAgICAgIHRoaXMuX2NhY2hlID0ge307XG4gICAgICAgIHRoaXMuX3JlcXVlc3RzID0gMDtcbiAgICAgICAgdGhpcy5iYXNlVXJsID0gYmFzZVVybDtcbiAgICAgICAgdGhpcy5jYWNoZVRpbWVvdXQgPSAoY2FjaGVUaW1lb3V0IDwgMCA/IDAgOiBjYWNoZVRpbWVvdXQpO1xuICAgICAgICB0aGlzLnJlc3BvbnNlVGltZW91dCA9IChyZXNwb25zZVRpbWVvdXQgPCAwID8gMCA6IHJlc3BvbnNlVGltZW91dCk7XG4gICAgfVxuICAgIEFqYXgucHJvdG90eXBlLm9uRXJyb3IgPSBmdW5jdGlvbiAocHJvZ3Jlc3NFdmVudCkge1xuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udGV4dDtcbiAgICAgICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKCdlcnJvcicpO1xuICAgICAgICBlcnJvci5yZXN1bHQgPSB0aGlzLnJlc3BvbnNlLnRvU3RyaW5nKCk7XG4gICAgICAgIGVycm9yLnNlcnZlclN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICAgICAgICBlcnJvci50aW1lc3RhbXAgPSBwcm9ncmVzc0V2ZW50LnRpbWVTdGFtcDtcbiAgICAgICAgZXJyb3IudXJsID0gY29udGV4dC51cmw7XG4gICAgICAgIGlmIChjb250ZXh0LmlzQ291bnRpbmdSZXF1ZXN0KSB7XG4gICAgICAgICAgICBjb250ZXh0LmlzQ291bnRpbmdSZXF1ZXN0ID0gZmFsc2U7XG4gICAgICAgICAgICBjb250ZXh0LmFqYXguX3JlcXVlc3RzLS07XG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dC5yZWplY3QoZXJyb3IpO1xuICAgIH07XG4gICAgQWpheC5wcm90b3R5cGUub25Mb2FkID0gZnVuY3Rpb24gKHByb2dyZXNzRXZlbnQpIHtcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb250ZXh0LmlzQ291bnRpbmdSZXF1ZXN0KSB7XG4gICAgICAgICAgICBjb250ZXh0LmlzQ291bnRpbmdSZXF1ZXN0ID0gZmFsc2U7XG4gICAgICAgICAgICBjb250ZXh0LmFqYXguX3JlcXVlc3RzLS07XG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dC5yZXNvbHZlKHtcbiAgICAgICAgICAgIHJlc3VsdDogKHRoaXMucmVzcG9uc2UgfHwgJycpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICBzZXJ2ZXJTdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgICAgICAgdGltZXN0YW1wOiBwcm9ncmVzc0V2ZW50LnRpbWVTdGFtcCxcbiAgICAgICAgICAgIHVybDogY29udGV4dC51cmxcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBBamF4LnByb3RvdHlwZS5vblRpbWVvdXQgPSBmdW5jdGlvbiAocHJvZ3Jlc3NFdmVudCkge1xuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udGV4dDtcbiAgICAgICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKCd0aW1lb3V0Jyk7XG4gICAgICAgIGVycm9yLnJlc3VsdCA9IHRoaXMucmVzcG9uc2UudG9TdHJpbmcoKTtcbiAgICAgICAgZXJyb3Iuc2VydmVyU3RhdHVzID0gdGhpcy5zdGF0dXM7XG4gICAgICAgIGVycm9yLnRpbWVzdGFtcCA9IHByb2dyZXNzRXZlbnQudGltZVN0YW1wO1xuICAgICAgICBlcnJvci51cmwgPSBjb250ZXh0LnVybDtcbiAgICAgICAgaWYgKGNvbnRleHQuaXNDb3VudGluZ1JlcXVlc3QpIHtcbiAgICAgICAgICAgIGNvbnRleHQuaXNDb3VudGluZ1JlcXVlc3QgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnRleHQuYWpheC5fcmVxdWVzdHMtLTtcbiAgICAgICAgfVxuICAgICAgICBjb250ZXh0LnJlamVjdChlcnJvcik7XG4gICAgfTtcbiAgICBBamF4LnByb3RvdHlwZS5oYXNPcGVuUmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3JlcXVlc3RzIDwgMCkge1xuICAgICAgICAgICAgdGhpcy5fcmVxdWVzdHMgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAodGhpcy5fcmVxdWVzdHMgPiAwKTtcbiAgICB9O1xuICAgIEFqYXgucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiAodXJsUGF0aCkge1xuICAgICAgICB2YXIgYWpheCA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gYWpheC5iYXNlVXJsICsgdXJsUGF0aDtcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0geyBhamF4OiBhamF4LCByZXNvbHZlOiByZXNvbHZlLCByZWplY3Q6IHJlamVjdCwgdXJsOiB1cmwgfTtcbiAgICAgICAgICAgIGlmIChhamF4LmNhY2hlVGltZW91dCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgY2FjaGVkUmVzdWx0ID0gYWpheC5fY2FjaGVbdXJsXTtcbiAgICAgICAgICAgICAgICB2YXIgY2FjaGVUaW1lb3V0ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSArIGFqYXguY2FjaGVUaW1lb3V0O1xuICAgICAgICAgICAgICAgIGlmIChjYWNoZWRSZXN1bHQgJiZcbiAgICAgICAgICAgICAgICAgICAgY2FjaGVkUmVzdWx0LnRpbWVzdGFtcCA+IGNhY2hlVGltZW91dCkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNhY2hlZFJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVsZXRlIGFqYXguX2NhY2hlW3VybF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgc2VydmVyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICBzZXJ2ZXIuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICBjb250ZXh0LmlzQ291bnRpbmdSZXF1ZXN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChhamF4LmNhY2hlVGltZW91dCA8PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIHVybC5pbmRleE9mKCc/JykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZlci5vcGVuKCdHRVQnLCAodXJsICsgJz8nICsgKG5ldyBEYXRlKCkpLmdldFRpbWUoKSksIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VydmVyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFqYXguX3JlcXVlc3RzKys7XG4gICAgICAgICAgICAgICAgY29udGV4dC5pc0NvdW50aW5nUmVxdWVzdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgc2VydmVyLnRpbWVvdXQgPSBhamF4LnJlc3BvbnNlVGltZW91dDtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGFqYXgub25Mb2FkKTtcbiAgICAgICAgICAgICAgICBzZXJ2ZXIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBhamF4Lm9uRXJyb3IpO1xuICAgICAgICAgICAgICAgIHNlcnZlci5hZGRFdmVudExpc3RlbmVyKCd0aW1lb3V0JywgYWpheC5vblRpbWVvdXQpO1xuICAgICAgICAgICAgICAgIHNlcnZlci5zZW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoY2F0Y2hlZEVycm9yKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVycm9yID0gY2F0Y2hlZEVycm9yO1xuICAgICAgICAgICAgICAgIGVycm9yLnJlc3VsdCA9IChzZXJ2ZXIucmVzcG9uc2UgfHwgJycpO1xuICAgICAgICAgICAgICAgIGVycm9yLnRpbWVzdGFtcCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgZXJyb3Iuc2VydmVyU3RhdHVzID0gc2VydmVyLnN0YXR1cztcbiAgICAgICAgICAgICAgICBlcnJvci51cmwgPSBjb250ZXh0LnVybDtcbiAgICAgICAgICAgICAgICBpZiAoY29udGV4dC5pc0NvdW50aW5nUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmlzQ291bnRpbmdSZXF1ZXN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYWpheC5fcmVxdWVzdHMtLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gQWpheDtcbn0oKSk7XG5leHBvcnRzLkFqYXggPSBBamF4O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBhamF4XzEgPSByZXF1aXJlKFwiLi9hamF4XCIpO1xudmFyIHV0aWxpdGllc18xID0gcmVxdWlyZShcIi4vdXRpbGl0aWVzXCIpO1xudmFyIERpY3Rpb25hcnkgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhEaWN0aW9uYXJ5LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIERpY3Rpb25hcnkoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgRGljdGlvbmFyeS5wYXJzZSA9IGZ1bmN0aW9uIChzdHJpbmdpZmllZCkge1xuICAgICAgICB2YXIgZGljdGlvbmFyeVBhZ2UgPSB7fTtcbiAgICAgICAgdmFyIGNhdGVnb3J5U3BsaXQ7XG4gICAgICAgIHZhciBkaWN0aW9uYXJ5U2VjdGlvbjtcbiAgICAgICAgc3RyaW5naWZpZWRcbiAgICAgICAgICAgIC5zcGxpdChEaWN0aW9uYXJ5LkxJTkVfU0VQQVJBVE9SKVxuICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgICAgIGlmIChsaW5lLmluZGV4T2YoRGljdGlvbmFyeS5QQUlSX1NFUEFSQVRPUikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgZGljdGlvbmFyeVBhZ2VbbGluZV0gPSBkaWN0aW9uYXJ5U2VjdGlvbiA9IHt9O1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZGljdGlvbmFyeVNlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRlZ29yeVNwbGl0ID0gbGluZS5zcGxpdChEaWN0aW9uYXJ5LlBBSVJfU0VQQVJBVE9SLCAyKTtcbiAgICAgICAgICAgIGRpY3Rpb25hcnlTZWN0aW9uW2NhdGVnb3J5U3BsaXRbMF1dID0gKGNhdGVnb3J5U3BsaXRbMV0uc3BsaXQoRGljdGlvbmFyeS5WQUxVRV9TRVBBUkFUT1IpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkaWN0aW9uYXJ5UGFnZTtcbiAgICB9O1xuICAgIERpY3Rpb25hcnkuc3RyaW5naWZ5ID0gZnVuY3Rpb24gKG1hcmtkb3duUGFnZSkge1xuICAgICAgICB2YXIgc3RyaW5naWZpZWQgPSBbXTtcbiAgICAgICAgdmFyIG1hcmtkb3duU2VjdGlvbjtcbiAgICAgICAgT2JqZWN0XG4gICAgICAgICAgICAua2V5cyhtYXJrZG93blBhZ2UpXG4gICAgICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoaGVhZGxpbmUpIHtcbiAgICAgICAgICAgIHN0cmluZ2lmaWVkLnB1c2godXRpbGl0aWVzXzEuVXRpbGl0aWVzLmdldEtleShoZWFkbGluZSkpO1xuICAgICAgICAgICAgbWFya2Rvd25TZWN0aW9uID0gbWFya2Rvd25QYWdlW2hlYWRsaW5lXTtcbiAgICAgICAgICAgIE9iamVjdFxuICAgICAgICAgICAgICAgIC5rZXlzKG1hcmtkb3duU2VjdGlvbilcbiAgICAgICAgICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5naWZpZWQucHVzaCh1dGlsaXRpZXNfMS5VdGlsaXRpZXMuZ2V0S2V5KGNhdGVnb3J5KSArXG4gICAgICAgICAgICAgICAgICAgIERpY3Rpb25hcnkuUEFJUl9TRVBBUkFUT1IgK1xuICAgICAgICAgICAgICAgICAgICBtYXJrZG93blNlY3Rpb25bY2F0ZWdvcnldLmpvaW4oRGljdGlvbmFyeS5WQUxVRV9TRVBBUkFUT1IpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHN0cmluZ2lmaWVkLmpvaW4oRGljdGlvbmFyeS5MSU5FX1NFUEFSQVRPUik7XG4gICAgfTtcbiAgICBEaWN0aW9uYXJ5LnByb3RvdHlwZS5sb2FkRW50cnkgPSBmdW5jdGlvbiAoYmFzZU5hbWUsIHBhZ2VJbmRleCkge1xuICAgICAgICBpZiAocGFnZUluZGV4ID09PSB2b2lkIDApIHsgcGFnZUluZGV4ID0gMDsgfVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgLnJlcXVlc3QodXRpbGl0aWVzXzEuVXRpbGl0aWVzLmdldEtleShiYXNlTmFtZSkgK1xuICAgICAgICAgICAgRGljdGlvbmFyeS5GSUxFX1NFUEFSQVRPUiArXG4gICAgICAgICAgICBwYWdlSW5kZXggK1xuICAgICAgICAgICAgRGljdGlvbmFyeS5GSUxFX0VYVEVOU0lPTilcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAgICAgICByZXNwb25zZS5zZXJ2ZXJTdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIERpY3Rpb25hcnkucGFyc2UocmVzcG9uc2UucmVzdWx0KTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIERpY3Rpb25hcnkuRklMRV9FWFRFTlNJT04gPSAnLnR4dCc7XG4gICAgRGljdGlvbmFyeS5GSUxFX1NFUEFSQVRPUiA9ICctJztcbiAgICBEaWN0aW9uYXJ5LkxJTkVfU0VQQVJBVE9SID0gJ1xcbic7XG4gICAgRGljdGlvbmFyeS5QQUlSX1NFUEFSQVRPUiA9ICc6JztcbiAgICBEaWN0aW9uYXJ5LlZBTFVFX1NFUEFSQVRPUiA9ICc7JztcbiAgICByZXR1cm4gRGljdGlvbmFyeTtcbn0oYWpheF8xLkFqYXgpKTtcbmV4cG9ydHMuRGljdGlvbmFyeSA9IERpY3Rpb25hcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmZ1bmN0aW9uIF9fZXhwb3J0KG0pIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9hamF4XCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2RpY3Rpb25hcnlcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vbWFya2Rvd25cIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vc3RyXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3V0aWxpdGllc1wiKSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBzdHJfMSA9IHJlcXVpcmUoXCIuL3N0clwiKTtcbnZhciBIRUFETElORV9SRUdFWFAgPSAvXig/OiMrKFtcXHNcXFNdKil8KFtcXHNcXFNdKj8pXFxuKD86PXszLH18LXszLH0pKSQvO1xudmFyIFBBSVJfUkVHRVhQID0gL14oW15cXDpcXG5cXHJcXHRcXHZdKyk6KFtcXHNcXFNdKikkLztcbnZhciBQQUdFX1JFR0VYUCA9IC8oPzpeXFxuP3xcXG5cXG4pLXszLH0oPzpcXG5cXG58XFxuPyQpLztcbnZhciBQQVJBR1JBUEhfUkVHRVhQID0gL1xcbnsyLH0vO1xudmFyIE1hcmtkb3duID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNYXJrZG93bihtYXJrZG93bikge1xuICAgICAgICB0aGlzLl9wYWdlcyA9IFtdO1xuICAgICAgICB0aGlzLl9yYXcgPSBtYXJrZG93bjtcbiAgICAgICAgdGhpcy5wYXJzZShtYXJrZG93bik7XG4gICAgfVxuICAgIE1hcmtkb3duLnBhcnNlUGFnZSA9IGZ1bmN0aW9uIChtYXJrZG93blBhZ2UpIHtcbiAgICAgICAgdmFyIHBhZ2UgPSB7fTtcbiAgICAgICAgdmFyIG1hdGNoO1xuICAgICAgICB2YXIgc2VjdGlvbjtcbiAgICAgICAgbWFya2Rvd25QYWdlXG4gICAgICAgICAgICAuc3BsaXQoUEFSQUdSQVBIX1JFR0VYUClcbiAgICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChwYXJhZ3JhcGgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gSEVBRExJTkVfUkVHRVhQLmV4ZWMocGFyYWdyYXBoKTtcbiAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIHBhZ2Vbc3RyXzEuU3RyLnRyaW1TcGFjZXMobWF0Y2hbMV0gfHwgbWF0Y2hbMl0pXSA9IHNlY3Rpb24gPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghc2VjdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hdGNoID0gUEFJUl9SRUdFWFAuZXhlYyhwYXJhZ3JhcGgpO1xuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgc2VjdGlvblttYXRjaFsxXV0gPSBtYXRjaFsyXVxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoJzsnKVxuICAgICAgICAgICAgICAgICAgICAubWFwKHN0cl8xLlN0ci50cmltU3BhY2VzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYWdlO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hcmtkb3duLnByb3RvdHlwZSwgXCJwYWdlc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2VzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWFya2Rvd24ucHJvdG90eXBlLCBcInJhd1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JhdztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTWFya2Rvd24ucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gKG1hcmtkb3duKSB7XG4gICAgICAgIHZhciBwYWdlcyA9IHRoaXMuX3BhZ2VzO1xuICAgICAgICBtYXJrZG93blxuICAgICAgICAgICAgLnNwbGl0KFBBR0VfUkVHRVhQKVxuICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKHBhZ2UpIHsgcmV0dXJuIHBhZ2VzLnB1c2goTWFya2Rvd24ucGFyc2VQYWdlKHBhZ2UpKTsgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gTWFya2Rvd247XG59KCkpO1xuZXhwb3J0cy5NYXJrZG93biA9IE1hcmtkb3duO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBCUkFDS0VUX1JFR0VYUCA9IC9cXChbXlxcKV0qXFwpfFxcW1teXFxdXSpcXF18XFx7W15cXH1dKlxcfS9nO1xudmFyIFNQQUNFX1JFR0VYUCA9IC9cXHMrL2c7XG52YXIgU3RyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU3RyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFN0cihzdHIpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIHN0cikgfHwgdGhpcztcbiAgICB9XG4gICAgU3RyLmVuZHNXaXRoID0gZnVuY3Rpb24gKHN0ciwgcGF0dGVybikge1xuICAgICAgICBpZiAoc3RyID09PSBwYXR0ZXJuKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RyTGVuZ3RoID0gc3RyLmxlbmd0aDtcbiAgICAgICAgdmFyIHBhdHRlcm5MZW5ndGggPSBwYXR0ZXJuLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIChwYXR0ZXJuTGVuZ3RoIDw9IHN0ckxlbmd0aCAmJlxuICAgICAgICAgICAgc3RyLmxhc3RJbmRleE9mKHBhdHRlcm4pID09PSBzdHJMZW5ndGggLSBwYXR0ZXJuTGVuZ3RoKTtcbiAgICB9O1xuICAgIFN0ci5yZW1vdmVCcmFja2V0cyA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKEJSQUNLRVRfUkVHRVhQLCAnJykucmVwbGFjZShTUEFDRV9SRUdFWFAsICcgJykudHJpbSgpO1xuICAgIH07XG4gICAgU3RyLnRyaW1TcGFjZXMgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZShTUEFDRV9SRUdFWFAsICcgJykudHJpbSgpO1xuICAgIH07XG4gICAgU3RyLnByb3RvdHlwZS5lbmRzV2l0aCA9IGZ1bmN0aW9uIChwYXR0ZXJuKSB7XG4gICAgICAgIHJldHVybiBTdHIuZW5kc1dpdGgodGhpcy50b1N0cmluZygpLCBwYXR0ZXJuKTtcbiAgICB9O1xuICAgIFN0ci5wcm90b3R5cGUucmVtb3ZlQnJhY2tldHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RyKFN0ci5yZW1vdmVCcmFja2V0cyh0aGlzLnRvU3RyaW5nKCkpKTtcbiAgICB9O1xuICAgIFN0ci5wcm90b3R5cGUudHJpbVNwYWNlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdHIoU3RyLnRyaW1TcGFjZXModGhpcy50b1N0cmluZygpKSk7XG4gICAgfTtcbiAgICByZXR1cm4gU3RyO1xufShTdHJpbmcpKTtcbmV4cG9ydHMuU3RyID0gU3RyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgTk9OX0NIQVJBQ1RFUl9SRUdFWFAgPSAvW14wLTlBLVphLXpcXHUwMDgwLVxcdUZGRkYgLV0vZztcbnZhciBQQVRIX1JFR0VYUCA9IC9eKC4qPykoW15cXC5cXC9dKikoW15cXC9dKikkLztcbnZhciBTUEFDRV9SRUdFWFAgPSAvXFxzKy9nO1xudmFyIFV0aWxpdGllcztcbihmdW5jdGlvbiAoVXRpbGl0aWVzKSB7XG4gICAgZnVuY3Rpb24gZ2V0RXh0ZW5zaW9uKGZpbGVQYXRoKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IFBBVEhfUkVHRVhQLmV4ZWMoZmlsZVBhdGgpO1xuICAgICAgICByZXR1cm4gKG1hdGNoICYmIG1hdGNoWzNdIHx8ICcnKTtcbiAgICB9XG4gICAgVXRpbGl0aWVzLmdldEV4dGVuc2lvbiA9IGdldEV4dGVuc2lvbjtcbiAgICBmdW5jdGlvbiBnZXRCYXNlTmFtZShmaWxlUGF0aCkge1xuICAgICAgICB2YXIgbWF0Y2ggPSBQQVRIX1JFR0VYUC5leGVjKGZpbGVQYXRoKTtcbiAgICAgICAgcmV0dXJuIChtYXRjaCAmJiBtYXRjaFsyXSB8fCAnJyk7XG4gICAgfVxuICAgIFV0aWxpdGllcy5nZXRCYXNlTmFtZSA9IGdldEJhc2VOYW1lO1xuICAgIGZ1bmN0aW9uIGdldEtleSh0ZXh0KSB7XG4gICAgICAgIHJldHVybiB0ZXh0XG4gICAgICAgICAgICAucmVwbGFjZShOT05fQ0hBUkFDVEVSX1JFR0VYUCwgJyAnKVxuICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgLnJlcGxhY2UoU1BBQ0VfUkVHRVhQLCAnLScpXG4gICAgICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgVXRpbGl0aWVzLmdldEtleSA9IGdldEtleTtcbiAgICBmdW5jdGlvbiBnZXROb3JtKHRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRleHRcbiAgICAgICAgICAgIC5yZXBsYWNlKE5PTl9DSEFSQUNURVJfUkVHRVhQLCAnICcpXG4gICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgICAucmVwbGFjZShTUEFDRV9SRUdFWFAsICcgJylcbiAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICBVdGlsaXRpZXMuZ2V0Tm9ybSA9IGdldE5vcm07XG4gICAgZnVuY3Rpb24gZ2V0UGFyZW50UGF0aChwYXRoKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IFBBVEhfUkVHRVhQLmV4ZWMocGF0aCk7XG4gICAgICAgIHJldHVybiAobWF0Y2ggJiYgbWF0Y2hbMV0gfHwgJycpO1xuICAgIH1cbiAgICBVdGlsaXRpZXMuZ2V0UGFyZW50UGF0aCA9IGdldFBhcmVudFBhdGg7XG4gICAgZnVuY3Rpb24gcm90YXRlKHRleHQpIHtcbiAgICAgICAgdmFyIGlzRGVjb2RlID0gdGV4dC5pbmRleE9mKCdiYXNlNjQsJykgPT09IDA7XG4gICAgICAgIGlmIChpc0RlY29kZSkge1xuICAgICAgICAgICAgdGV4dCA9IGF0b2IodGV4dC5zdWJzdHIoNykpO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgY2hhckNvZGUgPSAwLCBpbmRleCA9IDAsIGluZGV4RW5kID0gdGV4dC5sZW5ndGg7IGluZGV4IDwgaW5kZXhFbmQ7ICsraW5kZXgpIHtcbiAgICAgICAgICAgIGNoYXJDb2RlID0gdGV4dC5jaGFyQ29kZUF0KGluZGV4KTtcbiAgICAgICAgICAgIGNoYXJDb2RlICs9IChjaGFyQ29kZSA8IDEyOCA/IDEyOCA6IC0xMjgpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShjaGFyQ29kZSkpO1xuICAgICAgICB9XG4gICAgICAgIHRleHQgPSByZXN1bHQuam9pbignJyk7XG4gICAgICAgIGlmICghaXNEZWNvZGUpIHtcbiAgICAgICAgICAgIHRleHQgPSAnYmFzZTY0LCcgKyBidG9hKHRleHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICBVdGlsaXRpZXMucm90YXRlID0gcm90YXRlO1xuICAgIGZ1bmN0aW9uIHNwbGF0KG9iaikge1xuICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmpcbiAgICAgICAgICAgICAgICAucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2guYXBwbHkocmVzdWx0LCBzcGxhdCh2YWx1ZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHNwbGF0KE9iamVjdC52YWx1ZXMob2JqKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgVXRpbGl0aWVzLnNwbGF0ID0gc3BsYXQ7XG59KShVdGlsaXRpZXMgPSBleHBvcnRzLlV0aWxpdGllcyB8fCAoZXhwb3J0cy5VdGlsaXRpZXMgPSB7fSkpO1xuIl19
