export declare const string: (value: string) => string;
export declare const number: (value: string) => number | "*** invalid ***";
export declare const boolean: (value: string) => boolean | "*** invalid ***";
export declare const date: (value: any) => Date | "*** invalid ***";
export declare const object: (value: any) => any;
export declare const Types: {
    date: (value: any) => Date | "*** invalid ***";
    boolean: (value: string) => boolean | "*** invalid ***";
    number: (value: string) => number | "*** invalid ***";
    object: (value: any) => any;
    string: (value: string) => string;
};
export declare const TypeOrder: string[];
export declare const guess: (value: string) => string;
export declare const guessRange: (items: string[]) => any;
