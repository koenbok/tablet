import * as fs from "fs";
import * as _ from "lodash";
import * as Papa from "papaparse";
import * as convert from "./convert";
import * as types from "./types";

export const getRowsFromFile = async (path, start = 0, end = null) => {
  const config = {
    skipEmptyLines: true
  };

  const data = Papa.parse(fs.readFileSync(path).toString(), config);

  if (!end) {
    end = data.data.length;
  }

  return new Promise<string[][]>(resolve =>
    resolve(data.data.slice(start, end))
  );
};

export const sanitizeName = name => {
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
