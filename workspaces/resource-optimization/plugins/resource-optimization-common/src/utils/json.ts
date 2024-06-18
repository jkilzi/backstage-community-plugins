import camelCase from 'lodash/camelCase';
import { isNonNullableObject } from './TypeGuards';

export type JsonScalarValues = Boolean | null | number | string;

export interface JsonDictionary {
  [K: string]: JsonScalarValues | JsonDictionary | Array<JsonDictionary>;
}

export type JsonList = Array<JsonDictionary>;

const _toCamelCaseObjectKeysHelper = <TResult>(
  current: JsonDictionary | JsonList,
  accumulator: JsonDictionary | JsonList,
): TResult => {
  if (Array.isArray(current)) {
    for (const item of current) {
      if (Array.isArray(item)) {
        (accumulator as JsonList).push(_toCamelCaseObjectKeysHelper(item, []));
      } else if (isNonNullableObject(item)) {
        (accumulator as JsonList).push(_toCamelCaseObjectKeysHelper(item, {}));
      } else {
        (accumulator as JsonList).push(item);
      }
    }
  } else {
    for (const [k, v] of Object.entries(current)) {
      if (Array.isArray(v)) {
        (accumulator as JsonDictionary)[camelCase(k)] =
          _toCamelCaseObjectKeysHelper(v, []);
      } else if (isNonNullableObject(v)) {
        (accumulator as JsonDictionary)[camelCase(k)] =
          _toCamelCaseObjectKeysHelper(v, {});
      } else {
        (accumulator as JsonDictionary)[camelCase(k)] = v;
      }
    }
  }

  return accumulator as TResult;
};

export const toCamelCaseObjectKeys = <TResult>(
  root: JsonDictionary | JsonList,
) => {
  if (Array.isArray(root)) {
    return _toCamelCaseObjectKeysHelper<TResult>(root, []);
  } else if (isNonNullableObject(root)) {
    return _toCamelCaseObjectKeysHelper<TResult>(root, {});
  }

  throw new Error('Illegal argument exception');
};
