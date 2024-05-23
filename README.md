
[NSurreal Screencast.webm](https://github.com/netrondev/surreal/assets/3116694/9376eb7e-c7a5-48f6-971e-d8011a518259)

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

  const test = await client.query("select * from user;", "selectusers");
  // test now has automatic types!
}

test();

```
