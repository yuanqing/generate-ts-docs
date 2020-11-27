import * as ts from 'typescript'

import { ParameterData, ParametersJsDocData } from '../../types'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind'
import {
  getNextSiblingNode,
  getPreviousSiblingNode
} from './operations/get-sibling-node'
import { isKind } from './operations/is-kind'
import { serializeTypeNode } from './serialize-type-node'
import { traverseNode } from './traverse-node'

export function serializeParametersSyntaxListNode(
  node: ts.Node,
  parametersJsDoc: null | ParametersJsDocData
): Array<ParameterData> {
  const childNodes = node.getChildren().filter(function (node: ts.Node) {
    return (
      node.kind === ts.SyntaxKind.Parameter ||
      node.kind === ts.SyntaxKind.PropertySignature
    )
  })
  return childNodes.map(function (childNode: ts.Node) {
    const questionTokenNode = traverseNode(childNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
      getPreviousSiblingNode(),
      isKind(ts.SyntaxKind.QuestionToken)
    ])
    const optional = questionTokenNode !== null
    const name = parseIdentifierName(childNode)
    const description = parametersJsDoc === null ? null : parametersJsDoc[name]
    const typeNode = traverseNode(childNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
      getNextSiblingNode()
    ])
    if (typeNode === null) {
      throw new Error('`typeNode` is null')
    }
    return {
      description: typeof description === 'undefined' ? null : description,
      name,
      optional,
      type: serializeTypeNode(
        typeNode,
        parametersJsDoc === null
          ? null
          : transformParametersJsDoc(parametersJsDoc, `${name}.`)
      )
    }
  })
}

function parseIdentifierName(node: ts.Node): string {
  const result: Array<string> = []
  for (const childNode of node.getChildren()) {
    result.push(childNode.getText())
    if (childNode.kind === ts.SyntaxKind.Identifier) {
      break
    }
  }
  return result.join('')
}

// pass in the relevant subset of items in `parametersJsDoc`
function transformParametersJsDoc(
  parametersJsDoc: ParametersJsDocData,
  prefix: string
) {
  const result: ParametersJsDocData = {}
  for (const key in parametersJsDoc) {
    if (key.indexOf(prefix) === 0) {
      result[key.slice(prefix.length)] = parametersJsDoc[key]
    }
  }
  return result
}
