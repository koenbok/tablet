import * as moment from "moment";

import { Table } from "./table";

test("csv import", async () => {
  const table = await Table.import.csv("extras/csv/test.csv");

  expect(table.headers).toEqual(["name", "age", "date"]);
  expect(table.types).toEqual(["string", "number", "date"]);
  expect(table.structure).toEqual({
    name: "string",
    age: "number",
    date: "date"
  });
  expect(table.column("name")).toEqual(["Koen", "Jorn", "Sara"]);
  expect(table.column("age")).toEqual([35, 30, 27]);
  expect(table.column("date")).toEqual([
    moment.utc("2016-10-11", "YYYY-MM-DD").toDate(),
    moment.utc("1996-7-11", "YYYY-MM-DD").toDate(),
    moment.utc("2008-8-11", "YYYY-MM-DD").toDate()
  ]);

  expect((await table.query("select name from canbeanything")).data()).toEqual([
    { name: "Koen" },
    { name: "Jorn" },
    { name: "Sara" }
  ]);

  expect((await table.query("select date from canbeanything")).data()).toEqual([
    { date: moment.utc("2016-10-11", "YYYY-MM-DD").toDate() },
    { date: moment.utc("1996-7-11", "YYYY-MM-DD").toDate() },
    { date: moment.utc("2008-8-11", "YYYY-MM-DD").toDate() }
  ]);
});

test("csv import 2", async () => {
  const table = await Table.import.csv("extras/csv/test2.csv");

  expect(table.headers).toEqual(["date", "qty", "cur", "total", "name"]);
  expect(table.types).toEqual(["date", "number", "string", "number", "string"]);

  expect(table.column("name")).toEqual(["Koen", "Koen"]);
  expect(table.column("total")).toEqual([1438.5, 1440.3]);
});

test("data import", async () => {
  const table = Table.import.data([
    { name: "koen", age: 35 },
    { name: "jorn", age: 33 }
  ]);

  expect(table.headers).toEqual(["name", "age"]);
  expect(table.types).toEqual(["string", "number"]);

  expect(table.column("name")).toEqual(["koen", "jorn"]);
  expect(table.column("age")).toEqual([35, 33]);
});

test("object data import", async () => {
  const table = Table.import.data([{ name: "koen", test: { a: 1, b: 2 } }]);

  expect(table.headers).toEqual(["name", "test"]);
  expect(table.rows()).toEqual([["koen", { a: 1, b: 2 }]]);
  expect((await table.query("select name, test from data")).data()).toEqual([
    {
      name: "koen",
      test: { a: 1, b: 2 }
    }
  ]);
});

test("object data import", async () => {
  const table = Table.import.data([
    {
      subscription_id: 207389,
      plan_id: 512500,
      user_id: 342539,
      user_email: "koen@aap.com",
      state: "active",
      signup_date: "2017-07-21 16:48:43",
      last_payment: { amount: 159, currency: "USD", date: "2017-07-21" },
      next_payment: { amount: 159, currency: "USD", date: "2018-07-21" }
    }
  ]);

  expect(table.headers).toEqual([
    "subscription_id",
    "plan_id",
    "user_id",
    "user_email",
    "state",
    "signup_date",
    "last_payment",
    "next_payment"
  ]);

  expect((await table.query("select last_payment from data")).data()).toEqual([
    {
      last_payment: { amount: 159, currency: "USD", date: "2017-07-21" }
    }
  ]);
});

test("local db", async () => {
  const url = "postgres://127.0.0.1:5432/exporttest";
  const table = await Table.import.csv("extras/csv/test2.csv");

  table.export.sql(url);

  // local: new Sequelize("framer-data", "", "", {
  // 	logging: null,
  // 	dialect: "postgres",
  // 	dialectOptions: {
  // 		socketPath: "/home/pgdba/data/5432/.s.PGSQL.5432",
  // 	}
  // }),
});
