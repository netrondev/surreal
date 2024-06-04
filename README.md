![NSurreal_Screencast](https://github.com/netrondev/surreal/assets/3116694/c91df4de-2943-454e-9423-546c80fcb5f4)

The plan is to provide a way to use SurrealDB ( https://surrealdb.com/ ) with type safety automatically.

Github: 
https://github.com/netrondev/surreal

JSR:
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

`pnpm add dotenv zod`

```ts
import { NSurreal } from "@netron/surreal";
import { z } from "zod";

// Once generated switch to this.
import { Queries } from "./src/generated/combined";
require("dotenv").config();

// before generated use this blank type. Remove after first run.
type Queries = {}

async function test() {
  const env = {
    SURREALDB_HOST: z.string().parse(process.env.SURREALDB_HOST),
    SURREALDB_NS: z.string().parse(process.env.SURREALDB_NS),
    SURREALDB_DB: z.string().parse(process.env.SURREALDB_DB),
    SURREALDB_USER: z.string().parse(process.env.SURREALDB_USER),
    SURREALDB_PASS: z.string().parse(process.env.SURREALDB_PASS),
  };

  const client = new NSurreal<Queries>();

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

  const test = await client.query(
    /* surrealql */ 
    `select * from user;`, 
    /* Give this query a unique type name. Must start with a Capital letter, and be a valid json key aswell. */
    `SelectUsers`,
    /* Optional options */
    {
      /** Switch to true to skip writing type updates to file. Helpful to manually override types. */
      skip_write: false
    }
    );

  // test now has automatic types!
  
}

test();

```

Works well when you do run on save. Also good to have the db locally so requests are nice and snappy.

```
npx tsx --watch test.ts
```