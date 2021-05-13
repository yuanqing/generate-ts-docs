export function normalizeTypeString(string: string): string {
  return string.replace(/ {4}/g, '  ')
}
