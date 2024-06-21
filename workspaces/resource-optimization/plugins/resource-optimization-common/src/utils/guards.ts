import type {
  JsonArray,
  JsonObject,
  JsonPrimitive,
  JsonValue,
} from '@backstage/types';

export function isJsonValue(value: any): value is JsonValue {
  return isJsonPrimitive(value) || isJsonArray(value) || isJsonObject(value);
}

export function isJsonArray(value: any): value is JsonArray {
  return Array.isArray(value) && value.every(isJsonValue);
}

export function isJsonObject(value: any): value is JsonObject {
  return (
    value?.constructor.name === 'Object' &&
    Object.values(value).every(isJsonValue)
  );
}

export function isJsonPrimitive(value: any): value is JsonPrimitive {
  return (
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    value === null
  );
}
