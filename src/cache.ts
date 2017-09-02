import * as _ from "lodash";
import * as temp from "temp";
import * as fs from "fs";
import * as path from "path";

export const stringHash = (str: string) => {
  var hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0;
};

export const objectHash = (obj: any) => {
  return stringHash(JSON.stringify(obj)).toString();
};

export class Cache {
  private _hits = 0;
  private _domain: string;

  constructor(domain = "global") {
    this._domain = domain;
  }

  get hits() {
    return this._hits;
  }

  get dir() {
    return path.join(temp.dir, "tablet-cache-" + this._domain);
  }

  async promise(f: Function, ...args) {
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir);
    }

    const key = objectHash(args);
    const keyPath = path.join(this.dir, key + ".json");

    let result;

    try {
      result = JSON.parse(fs.readFileSync(keyPath).toString());
      this._hits++;
    } catch (error) {}

    if (!result) {
      result = await f.apply(this, args);
      fs.writeFileSync(keyPath, JSON.stringify(result));
    }

    return new Promise(resolve => resolve(result));
  }
}
