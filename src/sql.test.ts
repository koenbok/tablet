import * as _ from "lodash";
import * as sql from "./sql";
import * as Sequelize from "sequelize";

test("sql", async () => {
  const model = (await sql.createTable(
    "sqlite://:memory:",
    { name: "string", total: "number" },
    [["Koen", "100"], ["Jorn", "200"]],
    [{ unique: false, fields: ["name"] }]
  )).model;

  const rows = (await model.findAll()).map((row: any) => row.dataValues);

  expect(rows).toEqual([
    { id: 1, name: "Koen", total: 100 },
    { id: 2, name: "Jorn", total: 200 }
  ]);
});
