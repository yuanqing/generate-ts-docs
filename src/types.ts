import * as ts from 'typescript'

export type Operation = (node: ts.Node) => null | ts.Node

export type FunctionData = {
  description: null | string
  name: string
  parametersData: Array<ParameterData>
  returnType: null | ReturnTypeData
  tags: null | ParametersJsDocData
}

export type ParametersJsDocData = { [key: string]: null | string }

export type ParameterData = {
  description: null | string
  name: string
  optional: boolean
  type: string | ObjectData
}

export type ObjectData = {
  keys: Array<ParameterData>
  type: 'object'
}

export type ReturnTypeData = {
  description: null | string
  type: string
}
