import GithubSlugger from 'github-slugger'

import { FunctionData } from './types.js'
import { createFunctionTitle } from './utilities/create-function-title.js'

/**
 * Generate a Markdown table of contents for the given `categories`.
 *
 * @category Markdown table of contents
 */
export function renderCategoriesToMarkdownToc(
  categories: Array<{
    name: string
    functionsData: Array<FunctionData>
  }>
): string {
  const githubSlugger = new GithubSlugger()
  const lines = []
  for (const { name, functionsData } of categories) {
    lines.push(`- [**${name}**](#${githubSlugger.slug(name)})`)
    for (const { name, parameters, typeParameters } of functionsData) {
      const functionName = createFunctionTitle(name, typeParameters, parameters)
      lines.push(`  - [${functionName}](#${githubSlugger.slug(functionName)})`)
    }
  }
  return lines.join('\n')
}
