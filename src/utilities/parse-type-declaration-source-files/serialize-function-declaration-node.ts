import ts from 'typescript'

import { FunctionData } from '../../types.js'
import { normalizeReturnTypeString } from './normalize-return-type-string.js'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind.js'
import { getNextSiblingNode } from './operations/get-sibling-node.js'
import { isKind } from './operations/is-kind.js'
import { parseJsDoc } from './parse-js-doc.js'
import { serializeSyntaxListNode } from './serialize-parameters-syntax-list-node.js'
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
  const jsDoc = parseJsDoc(node)
  if (jsDoc === null) {
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
    description: jsDoc.description,
    jsDocTags: jsDoc.tags,
    name: identifierNode.getText(),
    parameters:
      parametersSyntaxListNode === null
        ? []
        : serializeSyntaxListNode(parametersSyntaxListNode, jsDoc.parameters),
    returnType: {
      description: jsDoc.returnType,
      type: normalizeReturnTypeString(returnTypeNode.getText())
    },
    typeParameters:
      typeParametersSyntaxListNode === null
        ? []
        : serializeTypeParametersSyntaxListNode(typeParametersSyntaxListNode)
  }
}
