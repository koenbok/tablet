export declare const InvalidValue = "*** invalid ***";
export declare type RawRowType = string[];
export declare type DataRowType = {
    [index: string]: any;
};
export declare type ValueType = "string" | "number" | "date" | "boolean" | "object";
export declare type StructureType = {
    [index: string]: ValueType;
};
export declare type InvalidValueType = typeof InvalidValue | null;
