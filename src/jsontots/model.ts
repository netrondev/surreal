export enum TypeGroup {
  Primitive,
  Array,
  Object,
  Date,
  RecordId,
  UUID,
}

export interface TypeDescription {
  id: string;
  isUnion?: boolean;
  typeObj?: Record<string, string>;
  arrayOfTypes?: string[];
}

export interface TypeStructure {
  rootTypeId: string;
  types: TypeDescription[];
}

export interface NameEntry {
  id: string;
  name: string;
}

export interface NameStructure {
  rootName: string;
  names: NameEntry[];
}

export interface InterfaceDescription {
  name: string;
  typeMap: object;
}

export interface Options {
  rootName?: string;
  /** To generate using type alias instead of interface */
  useTypeAlias?: boolean;
}

export interface KeyMetaData {
  keyValue: string | null;
  isOptional: boolean;
}
