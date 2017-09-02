"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const types = require("./types");
const convert = require("./convert");
exports.getDataHeaders = (rows) => {
    if (rows.length === 0) {
        return null;
    }
    return _.keys(rows[0]);
};
exports.getRowHeaders = (rows) => {
    if (rows.length === 0) {
        return null;
    }
    for (let header in rows[0]) {
        if (!_.isString(header)) {
            return null;
        }
        return rows[0];
    }
};
exports.getRowTypes = (rows) => {
    if (_.isPlainObject(rows[0])) {
        rows = rows.map(row => _.values(row));
    }
    let types = [];
    for (let i = 0; i < exports.getColumnCount(rows); i++) {
        types.push(convert.guessRange(exports.getColumn(rows, i)));
    }
    return types;
};
exports.getDataRows = (rows) => {
    return rows.map(_.values);
};
exports.getValueConverter = (type) => {
    return convert.Types[type];
};
exports.getConvertedValue = (type, value) => {
    const result = exports.getValueConverter(type)(value);
    if (result === types.InvalidValue) {
        throw Error(`getConvertedValue.${type} is invalid for '${value}' with type ${typeof value}`);
    }
    return result;
};
exports.getConvertedValues = (types, values) => {
    if (types.length !== values.length) {
        console.error("types: ", types);
        console.error("values: ", values);
        throw Error("getConvertedValues: invalid number of types");
    }
    return values.map((value, index) => exports.getConvertedValue(types[index], value));
};
exports.getColumnCount = (rows) => {
    if (rows.length === 0) {
        return 0;
    }
    return rows[0].length;
};
exports.getColumn = (rows, index) => {
    return rows.map(row => row[index]);
};
exports.findRow = (rows, key, value) => {
    for (let row of rows) {
        if (_.get(row, key) === value) {
            return row;
        }
    }
    return null;
};
//# sourceMappingURL=data.js.map