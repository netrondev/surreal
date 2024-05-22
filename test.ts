import { NSurreal } from "./mod";
import { z } from "zod";

require("dotenv").config();

async function runtest() {
  const client = new NSurreal();

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

  const res = await client.query(`select * from test;`);
}

runtest();
