import ts from 'typescript'

import { FunctionData } from '../../types.js'
import { normalizeReturnTypeString } from './utilities/normalize-return-type-string.js'
import { findFirstChildNodeOfKind } from './utilities/operations/find-first-child-node-of-kind.js'
import {
  getNextSiblingNode,
  getPreviousSiblingNode
} from './utilities/operations/get-sibling-node.js'
import { isKind } from './utilities/operations/is-kind.js'
import { parseJsDoc } from './utilities/parse-js-doc.js'
import { serializeSyntaxListNode } from './utilities/serialize-parameters-syntax-list-node.js'
import { serializeTypeParametersSyntaxListNode } from './utilities/serialize-type-parameters-syntax-list-node.js'
import { traverseNode } from './utilities/traverse-node.js'

/*
AST of `node`:
- JSDocComment
- SyntaxList
  - ExportKeyword
  - DeclareKeyword
- VariableDeclarationList
  - ConstKeyword
  - SyntaxList
    - VariableDeclaration <= `variableDeclarationNode`
      - Identifier <= `identifierNode`
      - ColonToken
      - FunctionType <= `functionTypeNode`
        - LessThanToken
        - SyntaxList <= `typeParametersSyntaxListNode`
          - ...
        - GreaterThanToken
        - OpenParenToken
        - SyntaxList <= `parametersSyntaxListNode`
          - ...
        - CloseParenToken
        - EqualsGreaterThanToken
        - ? <= `returnTypeNode`
- SemicolonToken
*/

export function serializeVariableStatementNode(
  node: ts.Node
): null | FunctionData {
  const jsDoc = parseJsDoc(node)
  if (jsDoc === null) {
    return null // Has `@ignore` tag
  }
  const variableDeclarationNode = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.VariableDeclarationList),
    findFirstChildNodeOfKind(ts.SyntaxKind.SyntaxList),
    findFirstChildNodeOfKind(ts.SyntaxKind.VariableDeclaration)
  ])
  if (variableDeclarationNode === null) {
    throw new Error('`variableDeclarationNode` is null')
  }
  const identifierNode = traverseNode(variableDeclarationNode, [
    findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
    getPreviousSiblingNode(),
    isKind(ts.SyntaxKind.Identifier)
  ])
  if (identifierNode === null) {
    throw new Error('`identifierNode` is null')
  }
  const functionTypeNode = traverseNode(variableDeclarationNode, [
    findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.FunctionType)
  ])
  if (functionTypeNode === null) {
    throw new Error('`functionTypeNode` is null')
  }
  const typeParametersSyntaxListNode = traverseNode(functionTypeNode, [
    findFirstChildNodeOfKind(ts.SyntaxKind.LessThanToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.SyntaxList)
  ])
  const parametersSyntaxListNodes = traverseNode(functionTypeNode, [
    findFirstChildNodeOfKind(ts.SyntaxKind.OpenParenToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.SyntaxList)
  ])
  const returnTypeNode = traverseNode(functionTypeNode, [
    findFirstChildNodeOfKind(ts.SyntaxKind.EqualsGreaterThanToken),
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
      parametersSyntaxListNodes === null
        ? []
        : serializeSyntaxListNode(parametersSyntaxListNodes, jsDoc.parameters),
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
