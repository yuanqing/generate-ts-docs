import { FunctionData } from './types'

/**
 * Groups each object in `functionsData` by the value of each function’s
 * `tags.category` key.
 *
 * @category Parse function data
 */
export function createCategories(
  functionsData: Array<FunctionData>
): Array<{
  name: string
  functionsData: Array<FunctionData>
}> {
  const result: { [name: string]: Array<FunctionData> } = {}
  for (const functionData of functionsData) {
    if (
      functionData.tags === null ||
      typeof functionData.tags.category === 'undefined'
    ) {
      throw new Error(
        `Category not defined for function \`${functionData.name}\``
      )
    }
    const name = functionData.tags.category
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
  const categories = []
  for (const name in result) {
    categories.push({
      functionsData: result[name],
      name
    })
  }
  return categories.sort(function (a, b) {
    return a.name.localeCompare(b.name)
  })
}
