import * as convert from "./convert";
import * as types from "./types";

test("string", () => {
  expect(convert.string("koen")).toBe("koen");
  expect(convert.string("koen is aardig")).toBe("koen is aardig");
});

test("number", () => {
  expect(convert.number("123")).toBe(123);
  expect(convert.number("a123")).toBe(types.InvalidValue);
  expect(convert.number("123.0")).toBe(123.0);
  expect(convert.number("0.123")).toBe(0.123);
  expect(convert.number("123.00")).toBe(123.0);
  expect(convert.number("123,0")).toBe(123.0);
  expect(convert.number("1,230")).toBe(1.23);
  expect(convert.number("1.230")).toBe(1.23);
  expect(convert.number("1,438.5")).toBe(1438.5);
  expect(convert.number("1.438,5")).toBe(1438.5);
  expect(convert.number("1.230,00")).toBe(1230);
  expect(convert.number("1,230.00")).toBe(1230);
});

test("boolean", () => {
  expect(convert.boolean("1")).toBe(true);
  expect(convert.boolean("0")).toBe(false);
  expect(convert.boolean("true")).toBe(true);
  expect(convert.boolean("false")).toBe(false);
  expect(convert.boolean("true ")).toBe(true);
  expect(convert.boolean(" fAlse")).toBe(false);
  expect(convert.boolean("koen")).toBe(types.InvalidValue);
  expect(convert.boolean("100")).toBe(types.InvalidValue);
  expect(convert.boolean("00100")).toBe(types.InvalidValue);
  expect(convert.boolean("001")).toBe(types.InvalidValue);
});

test("date", () => {
  expect(convert.date("1/1/2017")).toEqual(
    new Date("2017-01-01T00:00:00.000Z")
  );
  expect(convert.date("1/12/2017")).toEqual(
    new Date("2017-01-12T00:00:00.000Z")
  );
  expect(convert.date("1.12.2017")).toEqual(
    new Date("2017-12-01T00:00:00.000Z")
  );
  expect(convert.date("1-12-2017")).toEqual(
    new Date("2017-12-01T00:00:00.000Z")
  );
  expect(convert.date("13-13-2017")).toEqual(types.InvalidValue);
  expect(convert.date("12/1/2017")).toEqual(
    new Date("2017-12-01T00:00:00.000Z")
  );
  expect(convert.date("2006-11-09")).toEqual(
    new Date("2006-11-09T00:00:00.000Z")
  );
  expect(convert.date("Friday, August 4, 2017 6:18 PM")).toEqual(
    new Date("2017-08-04T18:18:00.000Z")
  );
  expect(convert.date("0001")).toEqual(types.InvalidValue);
  expect(convert.date("1000001")).toEqual(types.InvalidValue);
  expect(convert.date("1,438.5")).toEqual(types.InvalidValue);

  expect(convert.date("13-4-17")).toEqual(new Date("2017-04-13T00:00:00.000Z"));
  expect(convert.date("6-10-16")).toEqual(new Date("2016-10-06T00:00:00.000Z"));
});

test("guess", () => {
  expect(convert.guess(null)).toEqual(null);
  expect(convert.guess(undefined)).toEqual(null);
  expect(convert.guess("")).toEqual(null);
  expect(convert.guess("    ")).toEqual(null);
  expect(convert.guess("1/1/2017")).toEqual("date");
  expect(convert.guess("Friday, August 4, 2017 6:18 PM")).toEqual("date");
  expect(convert.guess("1/1/2017 test")).toEqual("string");
  expect(convert.guess("2.0")).toEqual("number");
  expect(convert.guess("2")).toEqual("number");
  expect(convert.guess("0001")).toEqual("number");
  expect(convert.guess("1000001")).toEqual("number");
  expect(convert.guess("123456789")).toEqual("number");
  expect(convert.guess("200.00")).toEqual("number");
  expect(convert.guess("0")).toEqual("boolean");
  expect(convert.guess("1")).toEqual("boolean");
  expect(convert.guess("2")).toEqual("number");
});

test("guessRange", () => {
  expect(convert.guessRange(["1/1/2017", "1/5/2017", , "1/5/2001"])).toEqual(
    "date"
  );
  expect(convert.guessRange(["1/1/2017", "1/5/2017", , "aap"])).toEqual(
    "string"
  );
  expect(convert.guessRange(["1/1/2017", "1/5/2017", , "123"])).toEqual(
    "string"
  );
  expect(convert.guessRange(["200", "200.00", "100000"])).toEqual("number");
  expect(convert.guessRange(["35", "30", " 27"])).toEqual("number");
  expect(convert.guessRange(["1", "2", "3"])).toEqual("number");
  expect(convert.guessRange(["aap", "noot", "mies"])).toEqual("string");
  expect(convert.guessRange(["aap", "noot", "mies", null])).toEqual("string");
  expect(convert.guessRange(["aap", "noot", "mies", null])).toEqual("string");
  expect(convert.guessRange(["0", "1", "1", "0"])).toEqual("boolean");
  expect(convert.guessRange(["0", "1", "2", "3"])).toEqual("number");
  expect(convert.guessRange(["0", "1", "2", "3", ""])).toEqual("number");
  expect(
    convert.guessRange([
      "Friday, August 4, 2017 6:18 PM",
      "Friday, August 6, 2012 6:18 PM",
      "Friday, August 8, 2018 6:18 PM"
    ])
  ).toEqual("date");
});
