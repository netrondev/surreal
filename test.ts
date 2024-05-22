import { NSurreal } from "./mod";
import { z } from "zod";
import { schema_generate } from "./src/generateschema";
import { type DB } from "./dbschema";

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

  const test = await client.query("SELECT * FROM user;");

  process.exit(0);
}

runtest();
