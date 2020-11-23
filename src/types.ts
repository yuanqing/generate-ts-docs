import * as ts from 'typescript'

export type FunctionDocEntry = {
  name: string
  description: null | string
  returnType: null | string
  parameters: Array<ParameterDocEntry>
}
export type ParameterDocEntry = {
  name: string
  description: null | string
  optional: boolean
  type: Array<string | FunctionTypeDocEntry | ObjectTypeDocEntry>
}

export interface FunctionTypeDocEntry {
  type: 'function'
  returnType: null | string
  parameters: Array<ParameterDocEntry>
}
export interface ObjectTypeDocEntry {
  type: 'object'
  keys: Array<ParameterDocEntry>
}

export type Operation = (node: ts.Node) => null | ts.Node
