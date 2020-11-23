import * as ts from 'typescript'

export type Operation = (node: ts.Node) => null | ts.Node

export type TypeData = Array<string | FunctionTypeData | ObjectTypeData>

export type FunctionData = {
  description: null | string
  name: string
  parameters: Array<ParameterData>
  returnType: null | TypeData
  tags: null | { [key: string]: string }
}
export type ParameterData = {
  description: null | string
  name: string
  optional: boolean
  type: TypeData
}

export interface FunctionTypeData {
  parameters: Array<ParameterData>
  returnType: null | TypeData
  type: 'function'
}
export interface ObjectTypeData {
  keys: Array<ParameterData>
  type: 'object'
}
