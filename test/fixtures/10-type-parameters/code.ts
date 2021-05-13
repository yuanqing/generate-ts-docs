export function foo<
  A extends string | number,
  B extends string | number = string,
  C = null
>(x: A, y: B, z: C): { x: A; y: B; z: C } {
  return { x, y, z }
}
