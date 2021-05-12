import ts from 'typescript'

import { FunctionData } from '../../types.js'
import { normalizeReturnTypeText } from './normalize-return-type-text.js'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind.js'
import { getNextSiblingNode } from './operations/get-sibling-node.js'
import { isKind } from './operations/is-kind.js'
import { parseJsDocComment } from './parse-js-doc-comment.js'
import { serializeParametersSyntaxListNode } from './serialize-parameters-syntax-list-node.js'
import { traverseNode } from './traverse-node.js'

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
    tags: jsDocComment.tags,
    typeParameters: []
  }
}
