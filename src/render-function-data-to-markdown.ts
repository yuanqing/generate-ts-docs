import { FunctionData, ParameterData } from './types'
import { createFunctionTitle } from './utilities/create-function-title'

const indentSize = 2

/**
 * @param options.headerLevel  Header level to be used for rendering the
 * function name. Defaults to `1` (ie. `#`).
 * @category Markdown
 */
export function renderFunctionDataToMarkdown(
  functionData: FunctionData,
  options?: { headerLevel: number }
): string {
  const headerLevel = typeof options === 'undefined' ? 1 : options.headerLevel
  const {
    description,
    name,
    parameters: parametersData,
    returnType
  } = functionData
  const lines: Array<string> = []
  lines.push(
    `${'#'.repeat(headerLevel)} ${createFunctionTitle(name, parametersData)}`
  )
  lines.push('')
  if (description !== null) {
    lines.push(`${description}`)
    lines.push('')
  }
  if (parametersData.length > 0) {
    lines.push(`${'#'.repeat(headerLevel + 1)} *Parameters*`)
    lines.push('')
    for (const parameterData of parametersData) {
      lines.push(stringifyParameter(parameterData, 0))
    }
    lines.push('')
  }
  if (returnType !== null) {
    lines.push(`${'#'.repeat(headerLevel + 1)} *Return type*`)
    lines.push('')
    if (returnType.description !== null) {
      lines.push(returnType.description)
      lines.push('')
    }
    lines.push('```')
    lines.push(returnType.type)
    lines.push('```')
    lines.push('')
  }
  return lines.join('\n')
}

function stringifyParameter(parameterData: ParameterData, indent: number) {
  const line: Array<string> = []
  const { description, name, optional, type } = parameterData
  line.push(
    `${' '.repeat(indent * indentSize)}- **\`${name}\`** (\`${
      typeof type === 'string' ? type : type.type
    }\`)`
  )
  if (optional === true || description !== null) {
    line.push('–') // en-dash
  }
  if (optional === true) {
    line.push('*Optional.*')
  }
  if (description !== null) {
    line.push(description)
  }
  const lines = [line.join(' ')]
  if (typeof type !== 'string') {
    for (const key of type.keys) {
      lines.push(stringifyParameter(key, indent + 1))
    }
  }
  return lines.join('\n')
}
