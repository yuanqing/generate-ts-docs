export function foo(x?: unknown, y?: unknown): { x?: unknown; y?: unknown } {
  return { x, y }
}
