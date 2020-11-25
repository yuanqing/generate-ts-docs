import { stringifyFunctionDataToMarkdown } from './stringify-function-data-to-markdown'
import { Category } from './types'

export function stringifyCategoryToMarkdown(
  category: Category,
  options?: { headerLevel: number }
): string {
  const headerLevel = typeof options === 'undefined' ? 2 : options.headerLevel
  const lines: Array<string> = []
  lines.push(`${'#'.repeat(headerLevel)} ${category.name}`)
  lines.push('')
  for (const functionData of category.functionsData) {
    lines.push(
      stringifyFunctionDataToMarkdown(functionData, {
        headerLevel: headerLevel + 1
      })
    )
  }
  return lines.join('\n')
}
