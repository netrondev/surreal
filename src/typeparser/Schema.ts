export type Table<T> = T;
export type Database<Schema> = {
  [TableName in keyof Schema]: Table<Schema[TableName]>;
};
