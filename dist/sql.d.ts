import * as Sequelize from "sequelize";
export declare const toSQL: (value: any) => any;
export declare const createTable: (url: string, structure: any, data: any[][], clear?: boolean, name?: string) => Promise<{
    sequelize: Sequelize.Sequelize;
    model: Sequelize.Model<{}, {}>;
}>;
