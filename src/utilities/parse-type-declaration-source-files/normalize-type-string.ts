export function normalizeTypeString(string: string) {
  return string.replace(/\n+/g, ' ').replace(/ +/g, ' ').trim()
}
