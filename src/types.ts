import * as ts from 'typescript'

export interface Base {
  name: string
  type: string
  description: null | string
}

export interface FunctionBase extends Base {
  type: 'function'
  returnType: null | string
  parameters: Array<Parameter>
}

export interface Parameter extends Base {
  optional: boolean
}
export interface FunctionParameter extends Parameter {
  type: 'function'
  returnType: null | string
  parameters: Array<Parameter>
}
export interface ObjectParameter extends Parameter {
  type: 'object'
  keys: null | Array<Parameter>
}

export type Operation = (node: ts.Node) => null | ts.Node

// export type DocEntry = {
//   name: string
//   type: string
//   description: null | string
//   data: null | TypeData | FunctionTypeData | ObjectTypeData
// }
// export interface TypeData {
//   optional?: boolean
// }
// export interface ObjectTypeData extends TypeData {
//   keys: null | Array<DocEntry>
// }
// export interface FunctionTypeData extends TypeData {
//   returnType: null | string
//   parameters: null | Array<DocEntry>
// }
