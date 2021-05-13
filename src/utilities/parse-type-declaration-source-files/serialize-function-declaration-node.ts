import ts from 'typescript'

import { FunctionData } from '../../types.js'
import { normalizeTypeString } from './normalize-type-string.js'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind.js'
import { getNextSiblingNode } from './operations/get-sibling-node.js'
import { isKind } from './operations/is-kind.js'
import { parseJsDocComment } from './parse-js-doc-comment.js'
import { serializeParametersSyntaxListNode } from './serialize-parameters-syntax-list-node.js'
import { serializeTypeParametersSyntaxListNode } from './serialize-type-parameters-syntax-list-node.js'
import { traverseNode } from './traverse-node.js'

/*
AST of `node`:
  - JSDocComment
    - ...
  - SyntaxList
    - ExportKeyword
    - DeclareKeyword
  - FunctionKeyword
  - Identifier <= `identifierNode`
  - LessThanToken
  - SyntaxList <= `typeParametersSyntaxListNode`
    - ...
  - GreaterThanToken
  - OpenParenToken
  - SyntaxList <= `parametersSyntaxListNode`
    - ...
  - CloseParenToken
  - ColonToken
  - ? <= `returnTypeNode`
  - SemicolonToken
*/

export function serializeFunctionDeclarationNode(
  node: ts.Node
): null | FunctionData {
  const jsDocComment = parseJsDocComment(node)
  if (jsDocComment === null) {
    return null // Has `@ignore` tag
  }
  const identifierNode = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.FunctionKeyword),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.Identifier)
  ])
  if (identifierNode === null) {
    throw new Error('`functionIdentifierNode` is null')
  }
  const typeParametersSyntaxListNode = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.FunctionKeyword),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.Identifier),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.LessThanToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.SyntaxList)
  ])
  const parametersSyntaxListNode = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.OpenParenToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.SyntaxList)
  ])
  const returnTypeNode = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.CloseParenToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.ColonToken),
    getNextSiblingNode()
  ])
  if (returnTypeNode === null) {
    throw new Error('`returnTypeNode` is null')
  }
  return {
    description: jsDocComment.description,
    name: identifierNode.getText(),
    parameters:
      parametersSyntaxListNode === null
        ? []
        : serializeParametersSyntaxListNode(
            parametersSyntaxListNode,
            jsDocComment.parameters
          ),
    returnType: {
      description: jsDocComment.returnType,
      type: normalizeTypeString(returnTypeNode.getText())
    },
    tags: jsDocComment.tags,
    typeParameters:
      typeParametersSyntaxListNode === null
        ? []
        : serializeTypeParametersSyntaxListNode(typeParametersSyntaxListNode)
  }
}
