export function foo(x: number, ...y: Array<number>): number {
  return y.reduce(function (sum: number, y: number): number {
    return sum + y
  }, x)
}
