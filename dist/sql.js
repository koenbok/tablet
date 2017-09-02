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
const _ = require("lodash");
const Sequelize = require("sequelize");
exports.toSQL = (value) => {
    if (_.isDate(value)) {
        return value;
    }
    if (_.isObject(value) || _.isArray(value)) {
        return "__json:" + JSON.stringify(value);
    }
    return value;
};
exports.createTable = (url, structure, data, clear = true, name = "data") => __awaiter(this, void 0, void 0, function* () {
    const typeMap = {
        date: Sequelize.DATE,
        number: Sequelize.DECIMAL,
        boolean: Sequelize.BOOLEAN,
        string: Sequelize.STRING,
        integer: Sequelize.INTEGER,
        object: Sequelize.STRING
    };
    let options = {
        logging: null
    };
    if (_.startsWith(url, "postgres://") && url.indexOf("ssl=true") !== -1) {
        options["native"] = true;
    }
    const sequelize = new Sequelize(url, options);
    const sequelizeStructure = _.mapValues(structure, type => typeMap[type]);
    const headers = _.keys(sequelizeStructure);
    const sequelizeOptions = {
        timestamps: false,
        tableName: name,
        version: false
    };
    const Model = sequelize.define(name, sequelizeStructure, sequelizeOptions);
    if (clear) {
        yield Model.drop();
    }
    yield Model.sync();
    yield Model.bulkCreate(data.map(row => {
        return _.zipObject(headers, row.map(exports.toSQL));
    }));
    return new Promise(resolve => {
        resolve({ sequelize: sequelize, model: Model });
    });
});
//# sourceMappingURL=sql.js.map