export function isNonNullableObject(
  value: any,
): value is Record<string, unknown> {
  return Boolean(value) && value.constructor.name === 'Object';
}
