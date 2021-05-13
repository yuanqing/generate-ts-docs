import { FunctionData } from './types.js'

/**
 * Groups each object in `functionsData` by the value of each function’s
 * `tags.category` key.
 *
 * @category Functions data
 */
export function createCategories(functionsData: Array<FunctionData>): Array<{
  name: string
  functionsData: Array<FunctionData>
}> {
  const result: Record<string, Array<FunctionData>> = {}
  for (const functionData of functionsData) {
    if (
      functionData.jsDocTags === null ||
      typeof functionData.jsDocTags.category === 'undefined'
    ) {
      throw new Error(
        `Category not defined for function \`${functionData.name}\``
      )
    }
    const name = functionData.jsDocTags.category
    if (name === null) {
      throw new Error(
        `Category not defined for function \`${functionData.name}\``
      )
    }
    if (typeof result[name] === 'undefined') {
      result[name] = []
    }
    result[name].push(functionData)
  }
  const categories: Array<{
    functionsData: Array<FunctionData>
    name: string
  }> = []
  for (const name in result) {
    categories.push({
      functionsData: result[name],
      name
    })
  }
  return categories.sort(function (a, b): number {
    return a.name.localeCompare(b.name)
  })
}
