import * as fs from "fs";
import * as _ from "lodash";
import * as Papa from "papaparse";
import * as sequelize from "sequelize";
import * as moment from "moment";
import * as convert from "./convert";
import * as types from "./types";
import * as sql from "./sql";
import * as utils from "./utils";
import * as data from "./data";

export class Table {
  private _headers: string[] = [];
  private _types: types.ValueType[] = [];
  private _rows: any[][] = [];

  static sql(path: string) {}

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

  row(index: number) {
    return this._rows[index];
  }

  rows() {
    return _.clone(this._rows);
  }

  data(): types.DataRowType[] {
    return this._rows.map(row => _.zipObject(this._headers, row));
  }

  column(column: number | string) {
    return this._rows.map(row => row[this.columnIndex(column)]);
  }

  private async _sql(url: string, tableName: string) {
    return sql.createTable(
      url,
      _.zipObject(this.headers, this.types),
      this.rows(),
      true,
      tableName
    );
  }

  async query(q: string, replace = true) {
    const tableName = "data";
    const { sequelize } = await this._sql("sqlite://:memory:", tableName);
    const regex = /from\s+([a-zA-Z0-9]+)/g;

    if (replace) {
      q = q.replace(regex, `from ${tableName}`);
    }

    const result = await sequelize.query(q);

    return new Promise<Table>(resolve => resolve(Table.import.data(result[0])));
  }

  // save(path: string) {}
  // csv(path: string) {}

  add(rows: any[][]) {
    rows.forEach((row, rowIndex) => {
      try {
        this._rows.push(data.getConvertedValues(this.types, row));
      } catch (error) {
        console.error(
          `Failed to add row at index ${rowIndex} or line ${rowIndex + 1}`
        );

        throw error;
      }
    });
  }

  merge(table: Table): Table {
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
        throw Error(
          `Table.merge: headers are not equal: ${_.difference(
            this.headers,
            table.headers
          )}`
        );
      }
    }

    merged.setStructure(headers, types);
    merged.add(this.rows());
    merged.add(table.rows());
    return merged;
  }

  map(f: (row: types.DataRowType) => types.DataRowType): Table {
    return Table.import.data(this.data().map(f));
  }

  /**
   * Returns the index for a column name. Throws and error if it does not exist.
   * @param name name of the column
   */
  columnIndex(name: string | number) {
    if (_.isNumber(name) && this.headers[name]) {
      return name;
    }
    const index = this._headers.indexOf(name as string);
    if (index === -1) {
      throw Error(`Table.columnIndex: no column named ${name}`);
    }
    return index;
  }

  columnType(name: string | number) {
    return this._types[this.columnIndex(name)];
  }

  columnConverter(name: string | number): (any) => any {
    const columnType = this.columnType(name);
    const columnConverter = convert.Types[columnType];

    if (!columnConverter) {
      throw Error(
        `Table.columnConverter: no converter for column ${name} with type ${columnType}`
      );
    }

    return columnConverter;
  }

  convertRow(row: any[]) {
    return row.map((value, column) => this.columnConverter(column)(value));
  }

  static import = {
    /**
     * Import from data objects like {name: "Koen", age: 35}
     */
    data: (rows: types.DataRowType[]) => {
      return Table.import.rows(
        data.getDataRows(rows),
        data.getDataHeaders(rows)
      );
    },

    /**
     * Imports from arrays, optionally guesses the columns and types.
     */
    rows: (rows: types.RawRowType[], headers?: string[]): Table => {
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
    csv: async (path: string, structure?: types.StructureType) => {
      const data = await utils.getRowsFromFile(path);
      const table = Table.import.rows(data);

      return new Promise<Table>(resolve => resolve(table));
    },

    /**
     * Imports from sqlite file.
     */
    sql: (path: string, tableName?: string) => {}
  };

  export = {
    csv: (path: string) => {
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

    sqlite: async (path: string, tableName?: string) => {
      await this._sql(`sqlite://${path}`, tableName);
    },

    sql: async (url: string, tableName?: string) => {
      await this._sql(url, tableName);
    }
  };
}
