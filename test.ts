import { NSurreal } from "./mod";
import { z } from "zod";
import { schema_generate } from "./src/generateschema";

// once generated, you can import the schema like this:
import { type DB } from "./dbschema";
import Surreal from "surrealdb.js";
import { surrealdbWasmEngines } from "surrealdb.wasm/lib/embedded";
import { SR_info } from "./src/surreal_helpers";

require("dotenv").config();

async function runtest() {
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

  await schema_generate({ db: client, fileout: "dbschema.ts" });
  // test should be typed now.

  process.exit(0);
}

runtest();
