export type FunctionData = {
  description: null | string
  name: string
  parameters: null | Array<ParameterData>
  returnType: null | ReturnTypeData
  jsDocTags: null | JsDocTagsData
  type: string
  typeParameters: null | Array<TypeParameterData>
}

export type JsDocTagsData = Record<string, null | string>

export type ObjectData = {
  keys: Array<ParameterData>
  type: 'object'
}

export type ParameterData = {
  description: null | string
  name: string
  optional: boolean
  rest: boolean
  type: string | ObjectData
}

export type ReturnTypeData = {
  description: null | string
  type: string
}

export type TypeParameterData = {
  name: string
  defaultType: null | string
  type: null | string
}
