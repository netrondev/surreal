/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Evaluate } from "./Evaluator";
import { type Parse } from "./Parser";
import { type Database } from "./Schema";

export type Query<SQL, DB extends Database<any>> = Evaluate<DB, Parse<SQL>>;
