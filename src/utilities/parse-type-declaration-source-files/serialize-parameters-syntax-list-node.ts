import * as ts from 'typescript'

import { ParameterData } from '../../types'
import { traverseNode } from './find-node'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind'
import {
  getNextSiblingNode,
  getPreviousSiblingNode
} from './operations/get-sibling-node'
import { isKind } from './operations/is-kind'
import { serializeTypeNode } from './serialize-type-node/serialize-type-node'

export function serializeParametersSyntaxListNode(
  node: ts.Node,
  parametersJsDoc: null | { [key: string]: string }
): Array<ParameterData> {
  const childNodes = node.getChildren().filter(function (node: ts.Node) {
    return (
      node.kind === ts.SyntaxKind.Parameter ||
      node.kind === ts.SyntaxKind.PropertySignature
    )
  })
  return childNodes.map(function (childNode: ts.Node) {
    const identifierNode = childNode.getChildAt(0)
    if (typeof identifierNode === 'undefined') {
      throw new Error('`identifierNode` is undefined')
    }
    const questionTokenNode = traverseNode(childNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
      getPreviousSiblingNode(),
      isKind(ts.SyntaxKind.QuestionToken)
    ])
    const optional = questionTokenNode !== null
    const name = identifierNode.getText()
    const description = parametersJsDoc === null ? null : parametersJsDoc[name]
    const typeNode = traverseNode(childNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
      getNextSiblingNode()
    ])
    if (typeNode === null) {
      throw new Error('`typeNode` is null')
    }
    return {
      description,
      name,
      optional,
      type: serializeTypeNode(typeNode)
    }
  })
}
