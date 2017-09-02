### Tablet

Tablet is a data analysis toolkit that loads, transforms and writes data to different formats. 

#### Usage

A typical example is loading an arbitrary csv file, converting it to sqlite, running a query and storing the result in another sqlite database.

```
import { Table } from "tablet"

const tableA = await Table.import.csv("data.csv")
const tableB = await tableA.query("SELECT name, age, city FROM data")

tableB.export.sqlite("db.sqlite3")
```

Tablet tries to accurately guess your data structure like dates, numbers, booleans and strings so you can query them directly. It is pretty good at guessing formats through sampling, including currency formats and odd date formats.

#### Getting Started

- `npm install --save-dev tabletjs`

#### Documentations

For complete docs, see the generated documentation in docs.

- `Tablet.import.csv(path: string)` load a csv file and guess the structure.
- `tablet.export.csv(path: string)` write the data to a csv file (including headers).
- `tablet.export.sqlite(path: string)` write the data to an sqlite3 db.
- `tablet.export.sql(path: string)` write the data to an sql server (using Sequelize).
- `tablet.query(sql: string)` create a new Table with the resulting sql query.
- `tablet.map(f: Function)` create a new Table with the transformed data.
- `tablet.merge(table: Table)` create a new Table with the two merged tables.