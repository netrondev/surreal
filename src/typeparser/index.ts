// import { type Parse } from "./Parser";
// import { type Query } from "./Query";

export * from "./Schema";
export * from "./AST";
export * from "./Parser";
export * from "./Printer";
export * from "./Evaluator";
export * from "./Query";

// type ActiveThings = Query<
//   "SELECT id, name AS nom FROM things WHERE active = true",
//   typeof db
// >;

// // ActiveThings is now equal to the following type:
// type Expected = [{ id: 1; nom: "a" }, { id: 3; nom: "c" }];

// type Test = Parse<"SELECT id, name AS nom FROM things WHERE active = true">;
