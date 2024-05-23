import { NSurreal } from "./NSurreal";
import {
  SR_derive_fields_from_table,
  SR_getInfoForDB,
} from "./surreal_helpers";
import jsonToZod from "json-to-zod";
import fs from "fs";

export async function read_querytypes() {
  return new Promise<string[]>((resolve) => {
    fs.readdir("./src/generated/querytypes", (err, files) => {
      resolve(files.filter((i) => i.endsWith(".ts")));
    });
  });
}

export async function schema_generate(inputs: {
  db: NSurreal<any>;
  /** example: src/dbschema.ts */
  fileout?: string;
}) {
  const db = inputs.db;
  const dbinfo = await SR_getInfoForDB({ db });
  let schema_data = `import { z } from "zod";\n`;
  const names: { table: string; zodname: string; typename: string }[] = [];

  for (const table of Object.keys(dbinfo.tables)) {
    const rows = await SR_derive_fields_from_table({ db, table });
    const zodname = `TB${table}`;
    const typename = `TB${table}_type`;
    names.push({ table, zodname, typename });
    const o = jsonToZod(rows, zodname);
    schema_data += `export ${o}\nexport type ${typename} = z.infer<typeof ${zodname}>[number];\n\n`;
  }

  let combined = `export type DB = {\n`;
  names.forEach((i) => {
    combined += `  "${i.table}": ${i.typename}\n`;
  });

  combined += `}\n`;
  schema_data += combined;

  await fs.promises.writeFile(inputs.fileout ?? "src/dbschema.ts", schema_data);

  return { schema_data };
}
