import { Cache } from "./cache";

const f = async (n: number) => {
  return new Promise<number>(resolve => resolve(n * 100));
};

test("cached promise", async () => {
  const cache = new Cache("test-" + Date.now());

  expect(cache.hits).toBe(0);

  expect(await f(1)).toBe(100);
  expect(cache.hits).toBe(0);

  expect(await cache.promise(f, 1)).toBe(100);
  expect(cache.hits).toBe(0);

  expect(await cache.promise(f, 1)).toBe(100);
  expect(cache.hits).toBe(1);
});
