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
const fs = require("fs");
const _ = require("lodash");
const Papa = require("papaparse");
exports.getRowsFromFile = (path, start = 0, end = null) => __awaiter(this, void 0, void 0, function* () {
    const config = {
        skipEmptyLines: true
    };
    const data = Papa.parse(fs.readFileSync(path).toString(), config);
    if (!end) {
        end = data.data.length;
    }
    return new Promise(resolve => resolve(data.data.slice(start, end)));
});
exports.sanitizeName = name => {
    return _.trim(name)
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "_") // Replace spaces with -
        .replace(/-+/g, "_") // Replace - with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\_\_+/g, "_") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
};
//# sourceMappingURL=utils.js.map