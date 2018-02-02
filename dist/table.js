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
const moment = require("moment");
const convert = require("./convert");
const sql = require("./sql");
const utils = require("./utils");
const data = require("./data");
class Table {
    constructor() {
        this._headers = [];
        this._types = [];
        this._rows = [];
        this.export = {
            csv: (path) => {
                const convert = value => {
                    if (_.isDate(value)) {
                        return moment.utc(value).format("YYYY/MM/DD");
                    }
                    return value;
                };
                const data = this.data().map(row => {
                    return _.mapValues(row, convert);
                });
                fs.writeFileSync(path, Papa.unparse(data));
            },
            sqlite: (path, tableName) => __awaiter(this, void 0, void 0, function* () {
                yield this._sql(`sqlite://${path}`, tableName);
            }),
            sql: (url, tableName) => __awaiter(this, void 0, void 0, function* () {
                yield this._sql(url, tableName);
            })
        };
    }
    static sql(path) { }
    setStructure(headers, types) {
        this._headers = _.clone(headers);
        this._types = _.clone(types);
    }
    get structure() {
        return _.zipObject(this.headers, this.types);
    }
    get headers() {
        return _.clone(this._headers);
    }
    get types() {
        return _.clone(this._types);
    }
    row(index) {
        return this._rows[index];
    }
    rows() {
        return _.clone(this._rows);
    }
    data() {
        return this._rows.map(row => _.zipObject(this._headers, row));
    }
    column(column) {
        return this._rows.map(row => row[this.columnIndex(column)]);
    }
    _sql(url, tableName, indexes = []) {
        return __awaiter(this, void 0, void 0, function* () {
            return sql.createTable(url, _.zipObject(this.headers, this.types), this.rows(), indexes, true, tableName);
        });
    }
    query(q, replace = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const tableName = "data";
            const { sequelize } = yield this._sql("sqlite://:memory:", tableName);
            const regex = /from\s+([a-zA-Z0-9]+)/g;
            if (replace) {
                q = q.replace(regex, `from ${tableName}`);
            }
            const result = yield sequelize.query(q);
            return new Promise(resolve => resolve(Table.import.data(result[0])));
        });
    }
    // save(path: string) {}
    // csv(path: string) {}
    add(rows) {
        rows.forEach((row, rowIndex) => {
            try {
                this._rows.push(data.getConvertedValues(this.types, row));
            }
            catch (error) {
                console.error(`Failed to add row at index ${rowIndex} or line ${rowIndex + 1}`);
                throw error;
            }
        });
    }
    merge(table) {
        const merged = new Table();
        let headers = table.headers;
        let types = table.types;
        if (headers.length == 0) {
            headers = this.headers;
            types = this.types;
        }
        if (table.headers.length > 0 && this.headers.length > 0) {
            if (this.headers.join("-") !== table.headers.join("-")) {
                console.error(this.headers);
                console.error(table.headers);
                throw Error(`Table.merge: headers are not equal: ${_.difference(this.headers, table.headers)}`);
            }
        }
        merged.setStructure(headers, types);
        merged.add(this.rows());
        merged.add(table.rows());
        return merged;
    }
    map(f) {
        return Table.import.data(this.data().map(f));
    }
    /**
     * Returns the index for a column name. Throws and error if it does not exist.
     * @param name name of the column
     */
    columnIndex(name) {
        if (_.isNumber(name) && this.headers[name]) {
            return name;
        }
        const index = this._headers.indexOf(name);
        if (index === -1) {
            throw Error(`Table.columnIndex: no column named ${name}`);
        }
        return index;
    }
    columnType(name) {
        return this._types[this.columnIndex(name)];
    }
    columnConverter(name) {
        const columnType = this.columnType(name);
        const columnConverter = convert.Types[columnType];
        if (!columnConverter) {
            throw Error(`Table.columnConverter: no converter for column ${name} with type ${columnType}`);
        }
        return columnConverter;
    }
    convertRow(row) {
        return row.map((value, column) => this.columnConverter(column)(value));
    }
}
Table.import = {
    /**
     * Import from data objects like {name: "Koen", age: 35}
     */
    data: (rows) => {
        return Table.import.rows(data.getDataRows(rows), data.getDataHeaders(rows));
    },
    /**
     * Imports from arrays, optionally guesses the columns and types.
     */
    rows: (rows, headers) => {
        if (!rows.length) {
            return new Table();
        }
        if (!headers) {
            const guessedHeaders = data.getRowHeaders(rows);
            if (guessedHeaders) {
                rows = _.slice(rows, 1);
            }
            headers = guessedHeaders;
        }
        headers = headers.map(utils.sanitizeName);
        const types = data.getRowTypes(rows);
        const table = new Table();
        table.setStructure(headers, types);
        table.add(rows);
        return table;
    },
    /**
     * Imports from csv file, optionally guesses the columns and types.
     */
    csv: (path, structure) => __awaiter(this, void 0, void 0, function* () {
        const data = yield utils.getRowsFromFile(path);
        const table = Table.import.rows(data);
        return new Promise(resolve => resolve(table));
    }),
    /**
     * Imports from sqlite file.
     */
    sql: (path, tableName) => { }
};
exports.Table = Table;
//# sourceMappingURL=table.js.map