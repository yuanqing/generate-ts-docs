import * as ts from 'typescript'

import { Parameter } from '../../types'
import { traverseNode } from './find-node'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind'
import {
  getNextSiblingNode,
  getPreviousSiblingNode
} from './operations/get-sibling-node'
import { isKind } from './operations/is-kind'
import { serializeFunctionTypeNode } from './serialize-function-type-node'

export function serializeSyntaxListNode(
  node: ts.Node,
  parametersJsDoc: null | { [key: string]: string }
): Array<Parameter> {
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
    const optional = questionTokenNode === null
    const name = identifierNode.getText()
    const description = parametersJsDoc === null ? null : parametersJsDoc[name]
    const typeNode = traverseNode(childNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
      getNextSiblingNode()
    ])
    if (typeNode === null) {
      throw new Error('`typeNode` is null')
    }
    if (typeNode.kind === ts.SyntaxKind.FunctionType) {
      // function
      return {
        description,
        name,
        optional,
        type: 'function',
        ...serializeFunctionTypeNode(typeNode, null)
      }
    }
    if (typeNode.kind === ts.SyntaxKind.TypeLiteral) {
      // object
      const parametersSyntaxListNodes = traverseNode(typeNode, [
        findFirstChildNodeOfKind(ts.SyntaxKind.OpenBraceToken),
        getNextSiblingNode(),
        isKind(ts.SyntaxKind.SyntaxList)
      ])
      if (parametersSyntaxListNodes === null) {
        throw new Error('`parametersSyntaxListNodes` is null')
      }
      return {
        description,
        keys: serializeSyntaxListNode(parametersSyntaxListNodes, null),
        name,
        optional,
        type: 'object'
      }
    }
    return {
      description,
      name,
      optional,
      type: typeNode.getText()
    }
  })
}
