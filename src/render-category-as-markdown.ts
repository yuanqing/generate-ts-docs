import { renderFunctionDataAsMarkdown } from './render-function-data-as-markdown'
import { FunctionData } from './types'

/**
 * @param options.headerLevel  Header level to be used for rendering the
 * category name.
 * @category Render to Markdown
 */
export function renderCategoryAsMarkdown(
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
      renderFunctionDataAsMarkdown(functionData, {
        headerLevel: functionHeaderLevel
      })
    )
  }
  return lines.join('\n')
}
