import { FunctionData, ParameterData } from './types'

const indentSize = 4

export function stringifyFunctionDataToMarkdown(
  functionData: FunctionData,
  options?: { headerLevel: number }
): string {
  const headerLevel = typeof options === 'undefined' ? 3 : options.headerLevel
  const {
    description,
    name,
    parametersData: parametersData,
    returnType
  } = functionData
  const lines: Array<string> = []
  lines.push(
    `${'#'.repeat(headerLevel)} ${stringifyFunctionName(name, parametersData)}`
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
    lines.push('```')
    lines.push(returnType)
    lines.push('```')
    lines.push('')
  }
  return lines.join('\n')
}

function stringifyFunctionName(
  name: string,
  parametersData: Array<ParameterData>
): string {
  const parameters = parametersData.map(function ({ name }: ParameterData) {
    return name
  })
  const firstOptionalIndex = parametersData.findIndex(function ({
    optional
  }: ParameterData) {
    return optional === true
  })
  if (firstOptionalIndex === -1) {
    return `${name}(${parameters.join(', ')})`
  }
  const requiredParameters = parameters.slice(0, firstOptionalIndex)
  const optionalParameters = parameters.slice(firstOptionalIndex)
  return `${name}(${requiredParameters.join(', ')} [, ${optionalParameters.join(
    ', '
  )}])`
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
