import { ParameterData, TypeParameterData } from '../types.js'

export function createFunctionTitle(
  name: string,
  typeParameters: Array<TypeParameterData>,
  parameters: Array<ParameterData>
): string {
  const typeParameterNames = typeParameters.map(function ({
    name
  }: TypeParameterData): string {
    return name
  })
  const typeParametersString =
    typeParameterNames.length === 0
      ? ''
      : `&lt;${typeParameterNames.join(', ')}&gt;`
  const parameterNames = parameters.map(function ({
    name,
    rest
  }: ParameterData): string {
    if (rest === true) {
      return `...${name}`
    }
    return name
  })
  const firstOptionalParameterIndex = parameters.findIndex(function ({
    optional
  }: ParameterData): boolean {
    return optional === true
  })
  if (firstOptionalParameterIndex === -1) {
    // No optional parameters
    return `${name}${typeParametersString}(${parameterNames.join(', ')})`
  }
  const requiredParameters = parameterNames.slice(
    0,
    firstOptionalParameterIndex
  )
  const optionalParameters = parameterNames.slice(firstOptionalParameterIndex)
  if (requiredParameters.length === 0) {
    return `${name}${typeParametersString}([${optionalParameters.join(', ')}])`
  }
  return `${name}${typeParametersString}(${requiredParameters.join(
    ', '
  )} [, ${optionalParameters.join(', ')}])`
}
