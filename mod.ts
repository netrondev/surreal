import { ConnectionOptions, Surreal } from "surrealdb.js";

export class NSurreal {
  pool: { connected: Date; client: Surreal; active: boolean }[] = [];

  client: Surreal | undefined;

  constructor() {
    console.log("Hello World");
    this.client = new Surreal();
  }

  async connect(url: string, opts?: ConnectionOptions): Promise<void> {
    if (!this.client) throw new Error("Client not connected");
    await this.client.connect(url, opts);
    return;
  }

  async use(opts: { namespace: string; database: string }): Promise<void> {
    if (!this.client) throw new Error("Client not connected");
    await this.client.use(opts);
    return;
  }

  async query(query: string): Promise<any> {
    if (!this.client) throw new Error("Client not connected");
    return await this.client.query(query);
  }
}
