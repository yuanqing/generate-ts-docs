import * as ts from 'typescript'

export type DocEntry = {
  name: string
  type: string
  data: null | ObjectData | FunctionData
}

export type ObjectData = { keys: Array<DocEntry> }

export type FunctionData = {
  returnType: null | string
  parameters: null | Array<DocEntry>
}

export type Operation = (node: ts.Node) => null | ts.Node
