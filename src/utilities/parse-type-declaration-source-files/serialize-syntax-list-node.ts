import * as ts from 'typescript'

import { DocEntry } from '../../types'
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
): null | Array<DocEntry> {
  const childNodes = node.getChildren().filter(function (node: ts.Node) {
    return (
      node.kind === ts.SyntaxKind.Parameter ||
      node.kind === ts.SyntaxKind.PropertySignature
    )
  })
  return childNodes.map(function (childNode: ts.Node) {
    const identifierNode = traverseNode(childNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
      getPreviousSiblingNode(),
      isKind(ts.SyntaxKind.Identifier)
    ])
    if (identifierNode === null) {
      throw new Error('`identifierNode` is null')
    }
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
        data: serializeFunctionTypeNode(typeNode, null),
        description,
        name,
        type: 'function'
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
        data: {
          keys: serializeSyntaxListNode(parametersSyntaxListNodes, null)
        },
        description,
        name,
        type: 'object'
      }
    }
    return {
      data: null,
      description,
      name,
      type: typeNode.getText()
    }
  })
}
