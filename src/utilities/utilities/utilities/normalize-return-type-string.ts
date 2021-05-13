export function normalizeReturnTypeString(string: string): string {
  return string.replace(/ {4}/g, '  ')
}
