export type FunctionData = {
  description: null | string
  name: string
  parameters: Array<ParameterData>
  returnType: null | ReturnTypeData
  tags: null | TagsData
}

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

export type TagsData = { [key: string]: null | string }
