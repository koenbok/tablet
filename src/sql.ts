import * as _ from "lodash";
import * as Sequelize from "sequelize";

export const toSQL = (value: any) => {
  if (_.isDate(value)) {
    return value;
  }

  if (_.isObject(value) || _.isArray(value)) {
    return "__json:" + JSON.stringify(value);
  }

  return value;
};

export const createTable = async (
  url: string,
  structure: any,
  data: any[][],
  indexes = [],
  clear = true,
  name = "data"
) => {
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
    version: false,
    indexes: indexes
  };

  const Model = sequelize.define(name, sequelizeStructure, sequelizeOptions);

  if (clear) {
    await Model.drop();
  }

  await Model.sync();
  await Model.bulkCreate(
    data.map(row => {
      return _.zipObject(headers, row.map(toSQL));
    })
  );

  return new Promise<{
    sequelize: Sequelize.Sequelize;
    model: typeof Model;
  }>(resolve => {
    resolve({ sequelize: sequelize, model: Model });
  });
};
