import * as moment from "moment";
import * as utils from "./utils";
import * as data from "./data";

test("headers for rows", () => {
  expect(
    data.getRowHeaders([
      ["one", "two", "three"],
      ["1", "2", "3"],
      ["4", "5", "6"]
    ])
  ).toEqual(["one", "two", "three"]);
});

test("headers for objects", () => {
  expect(
    data.getDataHeaders([
      { name: "Koen", age: 22 },
      { name: "Koen", age: 22 },
      { name: "Koen", age: 22 }
    ])
  ).toEqual(["name", "age"]);
});

test("types for rows with strings", () => {
  expect(
    data.getRowTypes([
      ["koen", "100", "2006-10-11"],
      ["koen", "100", "2006-10-11"],
      ["koen", "100", "2006-10-11"]
    ])
  ).toEqual(["string", "number", "date"]);
});

test("types for rows with values", () => {
  expect(
    data.getRowTypes([
      ["koen", 100, new Date()],
      ["koen", 100, new Date()],
      ["koen", 100, new Date()]
    ])
  ).toEqual(["string", "number", "date"]);
});

test("rows for objects", () => {
  expect(
    data.getDataRows([
      { name: "Koen", age: 22 },
      { name: "Koen", age: 22 },
      { name: "Koen", age: 22 }
    ])
  ).toEqual([["Koen", 22], ["Koen", 22], ["Koen", 22]]);
});

test("converted value for type", () => {
  expect(data.getConvertedValue("string", "koen")).toBe("koen");
  expect(data.getConvertedValue("number", "200")).toBe(200);
  expect(data.getConvertedValue("number", 200)).toBe(200);
  expect(data.getConvertedValue("boolean", 1)).toBe(true);
  expect(data.getConvertedValue("date", "2012-12-12")).toBeInstanceOf(Date);

  expect(
    data.getConvertedValue(
      "object",
      "__json:" + JSON.stringify({ name: "koen" })
    )
  ).toEqual({ name: "koen" });
});

test("values for row with strings", () => {
  expect(
    data.getConvertedValues(
      ["number", "date", "string"],
      ["100", "2016-10-10", "koen"]
    )
  ).toEqual([100, moment.utc("2016-10-10").toDate(), "koen"]);
});

test("values for row with values", () => {
  expect(
    data.getConvertedValues(
      ["number", "date", "string"],
      [100, moment.utc("2016-10-10").toDate(), "koen"]
    )
  ).toEqual([100, moment.utc("2016-10-10").toDate(), "koen"]);
});

test("types as strings", () => {
  expect(
    data.getRowTypes([
      ["koen", "100", "2006-10-11"],
      ["koen", "100", "2006-10-11"],
      ["koen", "100", "2006-10-11"]
    ])
  ).toEqual(["string", "number", "date"]);
});

test("getRowsTypes as strings", () => {
  expect(
    data.getRowTypes([
      ["koen", 100, new Date()],
      ["koen", 100, new Date()],
      ["koen", 100, new Date()]
    ])
  ).toEqual(["string", "number", "date"]);
});

test("guessHeaders", () => {
  expect(data.getColumn([["1", "4"], ["2", "5"], ["3", "6"]], 0)).toEqual([
    "1",
    "2",
    "3"
  ]);

  expect(data.getColumn([["1", "4"], ["2", "5"], ["3", "6"]], 1)).toEqual([
    "4",
    "5",
    "6"
  ]);
});

test("sanitizeName", () => {
  expect(utils.sanitizeName("Koen is aardig")).toBe("koen_is_aardig");
  expect(utils.sanitizeName("Koen is     aardig")).toBe("koen_is_aardig");
  expect(utils.sanitizeName("hello-DAAR123")).toBe("hello_daar123");
  expect(utils.sanitizeName("The Date ")).toBe("the_date");
});

test("findRow", () => {
  const rows = [
    { name: "Koen", age: 35 },
    { name: "Ben", age: 25 },
    { name: "Jorn", age: 35 }
  ];

  expect(data.findRow(rows, "name", "Jorn")).toEqual({
    name: "Jorn",
    age: 35
  });

  expect(data.findRow(rows, "name", "Koen")).toEqual({
    name: "Koen",
    age: 35
  });

  expect(data.findRow(rows, "name", "Sara")).toEqual(null);
});

test("findRow nested", () => {
  const rows = [{ name: "Koen", color: { r: 100, g: 200, b: 200 } }];

  expect(data.findRow(rows, "color.r", 100)).toEqual({
    name: "Koen",
    color: { r: 100, g: 200, b: 200 }
  });
});
