import * as _ from "lodash";
import * as parseFormat from "moment-parseformat";
import * as moment from "moment";
import * as types from "./types";

export const string = (value: string): types.InvalidValueType | string => {
  if (_.isNil(value) || _.trim(value).length === 0) {
    return null;
  }
  return value.toString();
};

export const number = (value: string): types.InvalidValueType | number => {
  if (_.isNumber(value)) {
    return value;
  }

  if (_.isNil(value) || _.trim(value).length === 0) {
    return null;
  }

  value = _.trim(value);

  // 123
  if (value.match(/^[\d]+$/)) {
    return parseFloat(value);
  }

  // 123.00
  if (value.match(/^[\d]+[\.][\d]+$/)) {
    return parseFloat(value);
  }

  // 123,00
  if (value.match(/^[\d]+[,][\d]+$/)) {
    return parseFloat(value.replace(",", "."));
  }

  // 1,234.00
  if (value.match(/^\d{1,3}(,\d\d\d)+(\.\d+){0,1}$/)) {
    return parseFloat(value.replace(",", ""));
  }

  // 1.234,00
  if (value.match(/^\d{1,3}(\.\d\d\d)+(,\d+){0,1}$/)) {
    return parseFloat(value.replace(".", "").replace(",", "."));
  }

  return types.InvalidValue;
};

export const boolean = (value: string): types.InvalidValueType | boolean => {
  if (_.isBoolean(value)) {
    return value;
  }

  if (_.isNil(value) || _.trim(value).length === 0) {
    return null;
  }

  value = value.toString();

  if (value.length === 1 && parseFloat(value) === 1) {
    return true;
  }

  if (value.length === 1 && parseFloat(value) === 0) {
    return false;
  }

  if (_.trim(value.toLowerCase()) === "true") {
    return true;
  }

  if (_.trim(value.toLowerCase()) === "false") {
    return false;
  }

  return types.InvalidValue;
};

export const date = (value): types.InvalidValueType | Date => {
  if (_.isDate(value)) {
    return value;
  }

  if (_.isNil(value) || _.trim(value).length === 0) {
    return null;
  }

  value = _.trim(value);

  // If there is too little info for a good date, it's not a date
  if (value.length < 6) {
    return types.InvalidValue;
  }

  // If this looks too much like number, it is a number
  if (number(value) !== types.InvalidValue) {
    return types.InvalidValue;
  }

  let format = parseFormat(value);
  let date = moment.utc(value, ["D-M-YY", format], true);

  if (date.isValid()) {
    if (date.year() > 1000 && date.year() < 3000) {
      return date.toDate();
    }
  }

  return types.InvalidValue;
};

export const object = (value): types.InvalidValueType | any => {
  if (_.isNil(value) || _.trim(value).length === 0) {
    return null;
  }

  if (_.isPlainObject(value)) {
    return _.clone(value);
  }

  if (_.isString(value) && _.startsWith(value, "__json:")) {
    return JSON.parse(_.trimStart(value, "__json:"));
  }

  return types.InvalidValue;
};

export const Types = {
  date: date,
  boolean: boolean,
  number: number,
  object: object,
  string: string
};

export const TypeOrder = ["date", "boolean", "number", "string"];

export const guess = (value: string): string => {
  if (_.isNil(value) || _.trim(value).length === 0) {
    return null;
  }

  if (_.isDate(value)) {
    return "date";
  }

  if (!_.isString(value)) {
    return (typeof value).toLowerCase();
  }

  if (_.startsWith(value, "__json:")) {
    return (typeof JSON.parse(_.trimStart(value, "__json:"))).toLowerCase();
  }

  for (let type of TypeOrder) {
    if (Types[type](value) !== types.InvalidValue) {
      return type;
    }
  }

  throw Error(`Could not guess type for "${value}"`);
};

export const guessRange = (items: string[]) => {
  let type = null;

  for (let value of items) {
    if (_.isNil(value) || _.isEmpty(_.trim(value))) {
      continue;
    }

    let typeGuess = guess(value);

    if (type === null) {
      type = typeGuess;
    } else if (
      typeGuess === "number" &&
      (type === "integer" || type === "boolean")
    ) {
      type = "number";
    } else if (
      type === "number" &&
      (typeGuess === "integer" || typeGuess === "boolean")
    ) {
      type = "number";
    } else if (type === "boolean" && typeGuess === "integer") {
      type = "integer";
    } else if (type === "integer" && typeGuess === "boolean") {
      type = "integer";
    } else if (type !== typeGuess) {
      type = "string";
      break;
    }
  }

  if (type === null) {
    return "string";
  }

  return type;
};
