import * as ts from 'typescript'

export type Operation = (node: ts.Node) => null | ts.Node

export type FunctionData = {
  description: null | string
  name: string
  parameters: Array<ParameterData>
  returnType: string
  tags: null | { [key: string]: string }
}

export type ParameterData = {
  description: null | string
  name: string
  optional: boolean
  type: string | ObjectData
}

export interface ObjectData {
  keys: Array<ParameterData>
  type: 'object'
}
