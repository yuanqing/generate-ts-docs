import * as ts from 'typescript'

import { FunctionData } from '../../types'
import { normalizeReturnTypeText } from './normalize-return-type-text'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind'
import { getNextSiblingNode } from './operations/get-sibling-node'
import { isKind } from './operations/is-kind'
import { parseJsDocComment } from './parse-js-doc-comment'
import { serializeParametersSyntaxListNode } from './serialize-parameters-syntax-list-node'
import { traverseNode } from './traverse-node'

export function serializeFunctionDeclarationNode(
  node: ts.Node
): null | FunctionData {
  const jsDocComment = parseJsDocComment(node)
  if (jsDocComment === null) {
    return null
  }
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
  if (returnTypeNode === null) {
    throw new Error('`returnTypeNode` is null')
  }
  const name = functionIdentifierNode.getText()
  return {
    description: jsDocComment.description,
    name,
    parameters:
      parametersSyntaxListNode === null
        ? []
        : serializeParametersSyntaxListNode(
            parametersSyntaxListNode,
            jsDocComment.parameters
          ),
    returnType: {
      description: jsDocComment.returnType,
      type: normalizeReturnTypeText(returnTypeNode.getText())
    },
    tags: jsDocComment.tags
  }
}
