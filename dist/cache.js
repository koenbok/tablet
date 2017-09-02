"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const temp = require("temp");
const fs = require("fs");
const path = require("path");
exports.stringHash = (str) => {
    var hash = 5381, i = str.length;
    while (i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    return hash >>> 0;
};
exports.objectHash = (obj) => {
    return exports.stringHash(JSON.stringify(obj)).toString();
};
class Cache {
    constructor(domain = "global") {
        this._hits = 0;
        this._domain = domain;
    }
    get hits() {
        return this._hits;
    }
    get dir() {
        return path.join(temp.dir, "tablet-cache-" + this._domain);
    }
    promise(f, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.dir)) {
                fs.mkdirSync(this.dir);
            }
            const key = exports.objectHash(args);
            const keyPath = path.join(this.dir, key + ".json");
            let result;
            try {
                result = JSON.parse(fs.readFileSync(keyPath).toString());
                this._hits++;
            }
            catch (error) { }
            if (!result) {
                result = yield f.apply(this, args);
                fs.writeFileSync(keyPath, JSON.stringify(result));
            }
            return new Promise(resolve => resolve(result));
        });
    }
}
exports.Cache = Cache;
//# sourceMappingURL=cache.js.map