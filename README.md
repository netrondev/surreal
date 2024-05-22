# Early dev release

The plan is to provide a way to use surrealdb with type safety automatically.

https://jsr.io/@netron/surreal


# Usage

Make a .env file

```sh
SURREALDB_HOST="http://localhost:8000"
SURREALDB_USER="root"
SURREALDB_PASS="root"
SURREALDB_NS="test"
SURREALDB_DB="test"
```

Add .env and dont forget to add .env to .gitignore file

`pnpm add dotenv`

```ts
import NSurreal from "./mod";
import { z } from "zod";


import { schema_generate } from "./src/generateschema";

// once generated import
import { type DB } from "./dbschema";

// or use manually like this:
export type DB = {};

require("dotenv").config();

async function runtest() {

  // pass in DB type:
  const client = new NSurreal<DB>();

  const env = {
    SURREALDB_HOST: z.string().parse(process.env.SURREALDB_HOST),
    SURREALDB_NS: z.string().parse(process.env.SURREALDB_NS),
    SURREALDB_DB: z.string().parse(process.env.SURREALDB_DB),
    SURREALDB_USER: z.string().parse(process.env.SURREALDB_USER),
    SURREALDB_PASS: z.string().parse(process.env.SURREALDB_PASS),
  };

  await client.connect(`${process.env.SURREALDB_HOST}/rpc`, {
    namespace: env.SURREALDB_NS,
    database: env.SURREALDB_DB,
    auth: {
      username: env.SURREALDB_USER,
      password: env.SURREALDB_PASS,
      namespace: env.SURREALDB_NS,
      database: env.SURREALDB_DB,
    },
  });

  await client.use({
    namespace: env.SURREALDB_NS,
    database: env.SURREALDB_DB,
  });

  // Generate schema type file
  await schema_generate({ db: client, fileout: "dbschema.ts" });

  // Should be typed now!
  const test = await client.query("SELECT * FROM yourtable;");

}

```