export function normalizeReturnTypeText(text: string): string {
  return text.replace(/ {4}/g, '  ')
}
