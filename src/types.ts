export const InvalidValue = "*** invalid ***";

export type RawRowType = string[];
export type DataRowType = { [index: string]: any };
export type ValueType = "string" | "number" | "date" | "boolean" | "object";
export type StructureType = { [index: string]: ValueType };
export type InvalidValueType = typeof InvalidValue | null;
