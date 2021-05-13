export function foo<T extends string | number, S = null>(
  x: T,
  y: S
): { x: T; y: S } {
  return { x, y }
}
