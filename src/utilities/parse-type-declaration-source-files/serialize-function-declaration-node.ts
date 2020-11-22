import * as ts from 'typescript'

import { DocEntry } from '../../types'
import { traverseNode } from './find-node'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind'
import { getNextSiblingNode } from './operations/get-sibling-node'
import { isKind } from './operations/is-kind'
import { parseJsDocComment } from './parse-js-doc-comment'
import { serializeSyntaxListNode } from './serialize-syntax-list-node'

export function serializeFunctionDeclarationNode(node: ts.Node): DocEntry {
  const functionIdentifierNode = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.FunctionKeyword),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.Identifier)
  ])
  if (functionIdentifierNode === null) {
    throw new Error('`functionIdentifierNode` is null')
  }
  const parametersSyntaxListNode = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.OpenParenToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.SyntaxList)
  ])
  const returnTypeNode = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
    getNextSiblingNode()
  ])
  const { description, parametersJsDoc } = parseJsDocComment(node)
  return {
    data: {
      parameters:
        parametersSyntaxListNode === null
          ? null
          : serializeSyntaxListNode(parametersSyntaxListNode, parametersJsDoc),
      returnType: returnTypeNode === null ? null : returnTypeNode.getText()
    },
    description,
    name: functionIdentifierNode.getText(),
    type: 'function'
  }
}
