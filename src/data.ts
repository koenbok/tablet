import * as _ from "lodash";
import * as temp from "temp";
import * as fs from "fs";

import * as utils from "./utils";
import * as types from "./types";
import * as convert from "./convert";

export const getDataHeaders = (rows: types.DataRowType[]): string[] | null => {
  if (rows.length === 0) {
    return null;
  }

  return _.keys(rows[0]);
};

export const getRowHeaders = (rows: any[][]): string[] | null => {
  if (rows.length === 0) {
    return null;
  }

  for (let header in rows[0]) {
    if (!_.isString(header)) {
      return null;
    }
    return rows[0] as string[];
  }
};

export const getRowTypes = (rows: any[][]) => {
  if (_.isPlainObject(rows[0])) {
    rows = (rows as types.DataRowType[]).map(row => _.values(row)) as any[][];
  }

  let types = [];

  for (let i = 0; i < getColumnCount(rows as any[][]); i++) {
    types.push(convert.guessRange(getColumn(rows as any[][], i)));
  }

  return types as types.ValueType[];
};

export const getDataRows = (rows: types.DataRowType[]) => {
  return rows.map(_.values);
};

export const getValueConverter = (type: types.ValueType) => {
  return convert.Types[type];
};

export const getConvertedValue = (type: types.ValueType, value: any) => {
  const result = (getValueConverter as any)(type)(value);
  if (result === types.InvalidValue) {
    throw Error(
      `getConvertedValue.${type} is invalid for '${value}' with type ${typeof value}`
    );
  }
  return result;
};

export const getConvertedValues = (types: types.ValueType[], values: any[]) => {
  if (types.length !== values.length) {
    console.error("types: ", types);
    console.error("values: ", values);
    throw Error("getConvertedValues: invalid number of types");
  }
  return values.map((value, index) => getConvertedValue(types[index], value));
};

export const getColumnCount = (rows: string[][]) => {
  if (rows.length === 0) {
    return 0;
  }
  return rows[0].length;
};

export const getColumn = (rows: string[][], index: number) => {
  return rows.map(row => row[index]);
};

export const findRow = (
  rows: types.DataRowType[],
  key: string,
  value: any
): types.DataRowType | null => {
  for (let row of rows) {
    if (_.get(row, key) === value) {
      return row;
    }
  }

  return null;
};
