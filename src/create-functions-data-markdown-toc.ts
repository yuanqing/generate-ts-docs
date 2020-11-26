import { FunctionData } from './types'

import GithubSlugger = require('github-slugger')
import { createFunctionTitle } from './utilities/create-function-title'

/**
 * Generate a Markdown table of contents (TOC) for the given `functionsData`.
 *
 * @category Markdown utilities
 */
export function createFunctionsDataMarkdownToc(
  functionsData: Array<FunctionData>
): string {
  const githubSlugger = new GithubSlugger()
  const lines = []
  for (const { name, parametersData } of functionsData) {
    const functionName = createFunctionTitle(name, parametersData)
    lines.push(`- [${functionName}](${githubSlugger.slug(functionName)})`)
  }
  return lines.join('\n')
}
