import ts from 'typescript'

import { JsDocTagsData, ParameterData } from '../../types.js'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind.js'
import {
  getNextSiblingNode,
  getPreviousSiblingNode
} from './operations/get-sibling-node.js'
import { isKind } from './operations/is-kind.js'
import { serializeTypeNode } from './serialize-type-node.js'
import { traverseNode } from './traverse-node.js'

/*
AST of `node`:
- Parameter | PropertySignature
  - Identifier <= `identifierNode`
  - QuestionToken <= `questionTokenNode`
  - ColonToken
  - ? <= `typeNode`
- CommaToken
- Parameter | PropertySignature
  - ...
- CommaToken
- ...
- Parameter | PropertySignature
*/

export function serializeSyntaxListNode(
  node: ts.Node,
  jsDocData: null | JsDocTagsData
): Array<ParameterData> {
  const parameterNodes = node
    .getChildren()
    .filter(function (node: ts.Node): boolean {
      return (
        node.kind === ts.SyntaxKind.Parameter ||
        node.kind === ts.SyntaxKind.PropertySignature
      ) // When `node` is an object literal type
    })
  return parameterNodes.map(function (parameterNode: ts.Node): ParameterData {
    const identifierNode = traverseNode(parameterNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.Identifier)
    ])
    if (identifierNode === null) {
      throw new Error('`identifierNode` is null')
    }
    const questionTokenNode = traverseNode(parameterNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
      getPreviousSiblingNode(),
      isKind(ts.SyntaxKind.QuestionToken)
    ])
    const typeNode = traverseNode(parameterNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
      getNextSiblingNode()
    ])
    if (typeNode === null) {
      throw new Error('`typeNode` is null')
    }
    const name = identifierNode.getText()
    const description = jsDocData === null ? null : jsDocData[name]
    return {
      description: typeof description === 'undefined' ? null : description,
      name,
      optional: questionTokenNode !== null,
      type: serializeTypeNode(
        typeNode,
        jsDocData === null
          ? null
          : transformParametersJsDoc(jsDocData, `${name}.`)
      )
    }
  })
}

// Pass in the relevant subset of items in `parametersJsDoc`
function transformParametersJsDoc(
  parametersJsDoc: JsDocTagsData,
  prefix: string
) {
  const result: JsDocTagsData = {}
  for (const key in parametersJsDoc) {
    if (key.indexOf(prefix) === 0) {
      result[key.slice(prefix.length)] = parametersJsDoc[key]
    }
  }
  return result
}
