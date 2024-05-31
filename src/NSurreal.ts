import { ConnectionOptions, Surreal } from "surrealdb.js";
import { generate_unique_hash_repeatably } from "./hash";
import jsonToZod from "json-to-zod";
import fs from "fs";
import JsonToTS from "./jsontots";

/** TypeSafe SurrealDB Client https://jsr.io/@netron/surreal based on surrealdb.js
 * See https://surrealdb.com/docs/surrealdb/integration/sdks/javascript */
export class NSurreal<G extends Record<string, object> = {}> {
  client: Surreal;
  timer: NodeJS.Timeout;
  timestamp_connected: Date | undefined;
  url: string | undefined;
  opts: ConnectionOptions | undefined;
  output_path: string = "./src/generated";

  debug = false;

  constructor(options?: { output_path?: string; debug?: boolean }) {
    if (options?.output_path) {
      this.output_path = options.output_path;
    }

    if (options?.debug) {
      this.debug = options.debug;
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

  log(...input: any[]) {
    if (this.debug) console.log(`NSurreal -`, input);
  }

  async connect(url: string, opts?: ConnectionOptions): Promise<void> {
    this.log(`Connecting to ${url}`);
    if (!this.client) {
      this.log(`Client not connected`);
      throw new Error("Client not connected");
    }
    this.opts = opts;
    this.url = url;
    await this.client.connect(url, opts);
    this.log("Connected!");
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
    uniqueID: Q
  ): Promise<G[Q]> {
    this.log("Querying", query, uniqueID);
    query = query.trim();
    if (!this.client) throw new Error("Client not connected");

    if (!uniqueID) {
      throw new Error("uniqueID is required for query.");
    }

    const uid = uniqueID as string;

    // ensure uniqueId starts with capital.
    if (uid[0] != uid[0].toUpperCase()) {
      throw new Error("uniqueID must start with a capital letter.");
    }

    if (!/^[A-Z][A-Za-z0-9_]*$/.test(uid)) {
      throw new Error("uniqueID must be a valid identifier.");
    }

    // const stack = new Error();

    // if (!stack.stack) {
    //   throw new Error("Could not generate unique identifier for query.");
    // }

    const result = await this.client.query(query);

    this.log("Query result", result);

    if (uniqueID) {
      const uid = uniqueID as string;

      let querycount = query.split(";").length;
      if (query.endsWith(";")) {
        querycount -= 1;
      }

      this.log(`Query count: ${querycount}`);

      let responseobj: Record<string, (typeof result)[number]> = {};

      result.forEach((i, idx) => {
        responseobj[`${uid}_query${idx + 1}`] = i;
      });

      if (this.debug) {
        console.log(responseobj);
      }

      const ts = JsonToTS(responseobj, { useTypeAlias: true, rootName: uid });

      this.log("Generated types", ts);

      this.log(
        "Creating directory if needed.",
        `${this.output_path}/querytypes`
      );

      await fs.promises
        .mkdir(`${this.output_path}/querytypes`, {
          recursive: true,
        })
        .catch((err) => {
          this.log("Error creating directory", err);
        });

      let outputtype = ts.map((i, idx) => {
        if (idx == 0) {
          let output = i.split("\n").at(0)?.replace("{", "[");
          output += "\n";
          // change object to tuple..
          output += i
            .split("\n")
            .slice(1, -1)
            .map((x) => x.split(":")[1].slice(0, -1))
            .join(",\n");

          output += "\n";
          output += i.split("\n").at(-1)!.replace("}", "]");

          return output;
        }

        return i;
      });

      this.log("Writing to file", `${this.output_path}/querytypes/${uid}.ts`);

      await fs.promises
        .writeFile(
          `${this.output_path}/querytypes/${uid}.ts`,
          `import { RecordId } from "surrealdb.js";
export ${outputtype.join("\n")}`
        )
        .catch((err) => {
          this.log("Error writing to file", err);
        });

      let schemas = await this.read_querytypes();

      await fs.promises.writeFile(
        `${this.output_path}/combined.ts`,
        `import { z } from "zod";\n
${schemas
  .map((i) => {
    return `import { ${i.replace(".ts", "")} } from "./querytypes/${i.replace(
      ".ts",
      ""
    )}";`;
  })
  .join("\n")}
      
export type Queries = {\n${schemas
          .map((i) => `  "${i.replace(".ts", "")}": ${i.replace(".ts", "")}`)
          .join("\n")}\n}`
      );
    }

    return result as G[Q];
  }
}
