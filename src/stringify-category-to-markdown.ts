import { stringifyFunctionDataToMarkdown } from './stringify-function-data-to-markdown'
import { FunctionData } from './types'

/**
 * @param options.headerLevel  Header level to be used for rendering the
 * category name.
 * @category Markdown utilities
 */
export function stringifyCategoryToMarkdown(
  category: {
    name: string
    functionsData: Array<FunctionData>
  },
  options?: { headerLevel: number }
): string {
  const headerLevel = typeof options === 'undefined' ? 2 : options.headerLevel
  const lines: Array<string> = []
  lines.push(`${'#'.repeat(headerLevel)} ${category.name}`)
  lines.push('')
  const functionHeaderLevel = headerLevel + 1
  for (const functionData of category.functionsData) {
    lines.push(
      stringifyFunctionDataToMarkdown(functionData, {
        headerLevel: functionHeaderLevel
      })
    )
  }
  return lines.join('\n')
}
