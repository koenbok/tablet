import * as types from "./types";
export declare class Table {
    private _headers;
    private _types;
    private _rows;
    static sql(path: string): void;
    setStructure(headers: any, types: any): void;
    readonly structure: {};
    readonly headers: string[];
    readonly types: types.ValueType[];
    row(index: number): any[];
    rows(): any[][];
    data(): types.DataRowType[];
    column(column: number | string): any[];
    private _sql(url, tableName);
    query(q: string, replace?: boolean): Promise<Table>;
    add(rows: any[][]): void;
    merge(table: Table): Table;
    map(f: (row: types.DataRowType) => types.DataRowType): Table;
    /**
     * Returns the index for a column name. Throws and error if it does not exist.
     * @param name name of the column
     */
    columnIndex(name: string | number): number;
    columnType(name: string | number): types.ValueType;
    columnConverter(name: string | number): (any) => any;
    convertRow(row: any[]): any[];
    static import: {
        data: (rows: types.DataRowType[]) => Table;
        rows: (rows: string[][], headers?: string[]) => Table;
        csv: (path: string, structure?: types.StructureType) => Promise<Table>;
        sql: (path: string, tableName?: string) => void;
    };
    export: {
        csv: (path: string) => void;
        sqlite: (path: string, tableName?: string) => Promise<void>;
        sql: (url: string, tableName?: string) => Promise<void>;
    };
}
