import { RecordId } from "surrealdb.js";
import { KeyMetaData, TypeGroup, TypeDescription } from "./model";

export function isHash(str: string) {
  // sha 1 is 40.
  // sha 256 hash is 64 characters long
  return str.length === 64;
}

export function onlyUnique<G>(value: G, index: number, self: G[]) {
  return self.indexOf(value) === index;
}

export function isArray(x: unknown) {
  return Object.prototype.toString.call(x) === "[object Array]";
}

export function isNonArrayUnion(typeName: string) {
  const arrayUnionRegex = /^\(.*\)\[\]$/;

  return typeName.includes(" | ") && !arrayUnionRegex.test(typeName);
}

export function isObject(x: unknown) {
  return Object.prototype.toString.call(x) === "[object Object]" && x !== null;
}

export function isDate(x: unknown) {
  return x instanceof Date;
}

export function isRecordId(x: unknown) {
  return x instanceof RecordId;
}

export function parseKeyMetaData(key: string | null): KeyMetaData {
  const isOptional = key?.endsWith("--?") ?? false;

  if (isOptional) {
    return {
      isOptional,
      keyValue: key?.slice(0, -3) ?? null,
    };
  } else {
    return {
      isOptional,
      keyValue: key,
    };
  }
}

export function getTypeDescriptionGroup(desc: TypeDescription): TypeGroup {
  if (desc === undefined) {
    return TypeGroup.Primitive;
  } else if (desc.arrayOfTypes !== undefined) {
    return TypeGroup.Array;
  } else {
    return TypeGroup.Object;
  }
}

export function findTypeById(
  id: string,
  types: TypeDescription[]
): TypeDescription {
  return types.find((_) => _.id === id)!;
}
