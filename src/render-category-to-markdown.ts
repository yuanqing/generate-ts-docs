import { renderFunctionDataToMarkdown } from './render-function-data-to-markdown.js'
import { FunctionData } from './types.js'

/**
 * @param options.headerLevel  Header level to be used for rendering the
 * category name. Defaults to `1` (ie. `#`).
 * @category Markdown
 */
export function renderCategoryToMarkdown(
  category: {
    name: string
    functionsData: Array<FunctionData>
  },
  options?: { headerLevel: number }
): string {
  const headerLevel = typeof options === 'undefined' ? 1 : options.headerLevel
  const lines: Array<string> = []
  lines.push(`${'#'.repeat(headerLevel)} ${category.name}`)
  lines.push('')
  const functionHeaderLevel = headerLevel + 1
  for (const functionData of category.functionsData) {
    lines.push(
      renderFunctionDataToMarkdown(functionData, {
        headerLevel: functionHeaderLevel
      })
    )
  }
  return lines.join('\n')
}
