export declare const stringHash: (str: string) => number;
export declare const objectHash: (obj: any) => string;
export declare class Cache {
    private _hits;
    private _domain;
    constructor(domain?: string);
    readonly hits: number;
    readonly dir: string;
    promise(f: Function, ...args: any[]): Promise<{}>;
}
