import * as ts from 'typescript'

export type Operation = (node: ts.Node) => null | ts.Node

export type TypeData = Array<string | FunctionTypeData | ObjectTypeData>

export type FunctionData = {
  name: string
  description: null | string
  returnType: null | TypeData
  parameters: Array<ParameterData>
}
export type ParameterData = {
  name: string
  description: null | string
  optional: boolean
  type: TypeData
}

export interface FunctionTypeData {
  type: 'function'
  returnType: null | TypeData
  parameters: Array<ParameterData>
}
export interface ObjectTypeData {
  type: 'object'
  keys: Array<ParameterData>
}
