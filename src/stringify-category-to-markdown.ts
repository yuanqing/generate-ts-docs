import { stringifyFunctionDataToMarkdown } from './stringify-function-data-to-markdown'
import { Category, Options } from './types'

export function stringifyCategoryToMarkdown(
  category: Category,
  options: Options = { headerLevel: 2 }
): string {
  const { headerLevel } = options
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
