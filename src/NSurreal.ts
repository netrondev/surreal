import { ConnectionOptions, Surreal } from "surrealdb.js";
import { generate_unique_hash_repeatably } from "./hash";
import { Query } from "./typeparser/Query";
import { Database } from "./typeparser/Schema";
import jsonToZod from "json-to-zod";
import fs from "fs";

/** TypeSafe SurrealDB Client https://jsr.io/@netron/surreal based on surrealdb.js
 * See https://surrealdb.com/docs/surrealdb/integration/sdks/javascript */
export class NSurreal<G extends Record<string, object> = {}> {
  client: Surreal;
  timer: NodeJS.Timeout;
  timestamp_connected: Date | undefined;
  url: string | undefined;
  opts: ConnectionOptions | undefined;

  output_path: string = "./src/generated";

  constructor(options?: { output_path: string }) {
    if (options?.output_path) {
      this.output_path = options.output_path;
    }

    this.client = new Surreal();
    this.timer = setInterval(() => {
      if (!this.timestamp_connected) return;
      const diff = new Date().getTime() - this.timestamp_connected!.getTime();
      if (diff > 1000 * 60) {
        if (this.client) {
          this.client.close();
        }
        this.connect(this.url!, this.opts!);
      }
    }, 10000);
  }

  /** Connects to a local or remote database endpoint.
   * https://surrealdb.com/docs/surrealdb/integration/sdks/javascript#connect
   */
  async connect(url: string, opts?: ConnectionOptions): Promise<void> {
    if (!this.client) throw new Error("Client not connected");
    this.opts = opts;
    this.url = url;
    await this.client.connect(url, opts);
    this.timestamp_connected = new Date();
  }

  /** Switch to a specific namespace and database. If only the ns or db property is specified,
   * the current connection details will be used to fill the other property. */
  async use(opts: { namespace: string; database: string }): Promise<void> {
    if (!this.client) throw new Error("Client not connected");
    await this.client.use(opts);
    return;
  }

  /** lists the known schema types for queries. */
  async read_querytypes(): Promise<string[]> {
    return new Promise<string[]>((resolve) => {
      fs.readdir(`${this.output_path}/querytypes`, (err, files) => {
        resolve(files.filter((i) => i.endsWith(".ts")));
      });
    });
  }

  /** Runs a set of SurrealQL statements against the database.
   * See https://surrealdb.com/docs/surrealdb/integration/sdks/javascript#query
   */
  /** we create a unique tag for this query to link the output back to the type */

  async query<Q extends keyof G>(
    query: string,
    /** we create a unique tag for this query to link the output back to the type */
    uniqueID?: Q
  ): Promise<G[Q]> {
    if (!this.client) throw new Error("Client not connected");

    if (!uniqueID) {
      throw new Error("uniqueID is required for query.");
    }

    const stack = new Error();

    if (!stack.stack) {
      throw new Error("Could not generate unique identifier for query.");
    }

    // ================================================================================
    // Future Experiment.
    // Use stack trace to generate unique identifier for query.
    // Then we can possibly generate types for more complex queries automatically when they run.

    const unique_identifier_location = await generate_unique_hash_repeatably(
      stack.stack
    );
    const unique_identifier_query = await generate_unique_hash_repeatably(
      query
    );

    // console.log("--------------------");
    // console.log(unique_identifier_location);
    // console.log(unique_identifier_query);
    // console.log(query);
    // ================================================================================");

    const result = await this.client.query(query);

    if (uniqueID) {
      const uid = uniqueID as string;
      const query_response_type = jsonToZod(result, uid);

      await fs.promises.mkdir(`${this.output_path}/querytypes`, {
        recursive: true,
      });

      await fs.promises.writeFile(
        `${this.output_path}/querytypes/${uid}.ts`,
        `import { z } from "zod";\nexport ${query_response_type}\nexport type T${uid} = z.infer<typeof ${uid}>`
      );

      let schemas = await this.read_querytypes();

      await fs.promises.writeFile(
        `${this.output_path}/combined.ts`,
        `import { z } from "zod";\n
${schemas
  .map((i) => {
    return `import { T${i.replace(".ts", "")} } from "./querytypes/${i.replace(
      ".ts",
      ""
    )}";`;
  })
  .join("\n")}
      
export type Queries = {\n${schemas
          .map((i) => `  "${i.replace(".ts", "")}": T${i.replace(".ts", "")}`)
          .join("\n")}\n}`
      );
    }

    return result as G[Q];
  }
}
