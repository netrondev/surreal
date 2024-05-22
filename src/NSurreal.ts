import { ConnectionOptions, Surreal } from "surrealdb.js";
import { generate_unique_hash_repeatably } from "./hash";
import { Query } from "./typeparser/Query";
import { Database } from "./typeparser/Schema";

/** TypeSafe SurrealDB Client https://jsr.io/@netron/surreal based on surrealdb.js
 * See https://surrealdb.com/docs/surrealdb/integration/sdks/javascript */
export class NSurreal<G extends Database<any> = {}> {
  client: Surreal;
  timer: NodeJS.Timeout;
  timestamp_connected: Date | undefined;
  url: string | undefined;
  opts: ConnectionOptions | undefined;

  constructor() {
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

  /** Runs a set of SurrealQL statements against the database.
   * See https://surrealdb.com/docs/surrealdb/integration/sdks/javascript#query
   */
  async query<Q extends string>(query: Q): Promise<Query<Q, G>> {
    if (!this.client) throw new Error("Client not connected");

    const stack = new Error();

    if (!stack.stack) {
      throw new Error("Could not generate unique identifier for query.");
    }

    // ================================================================================
    // Future Experiment.
    // Use stack trace to generate unique identifier for query.
    // Then we can possibly generate types for more complex queries automatically when they run.

    // const unique_identifier_location = await generate_unique_hash_repeatably(
    //   stack.stack
    // );
    // const unique_identifier_query = await generate_unique_hash_repeatably(
    //   query
    // );

    // console.log("--------------------");
    // console.log(unique_identifier_location);
    // console.log(unique_identifier_query);
    // console.log(query);
    // ================================================================================");

    const result = await this.client.query(query);

    return result as Query<Q, G>;
  }
}
