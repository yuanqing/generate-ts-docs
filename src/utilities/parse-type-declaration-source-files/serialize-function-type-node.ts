import * as ts from 'typescript'

import { FunctionData } from '../../types'
import { traverseNode } from './find-node'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind'
import { getNextSiblingNode } from './operations/get-sibling-node'
import { isKind } from './operations/is-kind'
import { serializeSyntaxListNode } from './serialize-syntax-list-node'

export function serializeFunctionTypeNode(
  node: ts.Node,
  parametersJsDoc: null | { [key: string]: string }
): FunctionData {
  const returnTypeNode = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.EqualsGreaterThanToken),
    getNextSiblingNode()
  ])
  const parametersSyntaxListNodes = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.OpenParenToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.SyntaxList)
  ])
  return {
    parameters:
      parametersSyntaxListNodes === null
        ? null
        : serializeSyntaxListNode(parametersSyntaxListNodes, parametersJsDoc),
    returnType: returnTypeNode === null ? null : returnTypeNode.getText()
  }
}
