import ts from 'typescript'

import { FunctionData } from '../../types.js'
import { normalizeTypeString } from './normalize-type-string.js'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind.js'
import {
  getNextSiblingNode,
  getPreviousSiblingNode
} from './operations/get-sibling-node.js'
import { isKind } from './operations/is-kind.js'
import { parseJsDocComment } from './parse-js-doc-comment.js'
import { serializeParametersSyntaxListNode } from './serialize-parameters-syntax-list-node.js'
import { traverseNode } from './traverse-node.js'

export function serializeVariableStatementNode(
  node: ts.Node
): null | FunctionData {
  const jsDocComment = parseJsDocComment(node)
  if (jsDocComment === null) {
    return null
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
  const name = identifierNode.getText()
  const typeNode = traverseNode(variableDeclarationNode, [
    findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.FunctionType)
  ])
  if (typeNode === null) {
    throw new Error('`typeNode` is null')
  }
  const returnTypeNode = traverseNode(typeNode, [
    findFirstChildNodeOfKind(ts.SyntaxKind.EqualsGreaterThanToken),
    getNextSiblingNode()
  ])
  if (returnTypeNode === null) {
    throw new Error('`returnTypeNode` is null')
  }
  const parametersSyntaxListNodes = traverseNode(typeNode, [
    findFirstChildNodeOfKind(ts.SyntaxKind.OpenParenToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.SyntaxList)
  ])
  return {
    description: jsDocComment.description,
    name,
    parameters:
      parametersSyntaxListNodes === null
        ? []
        : serializeParametersSyntaxListNode(
            parametersSyntaxListNodes,
            jsDocComment.parameters
          ),
    returnType: {
      description: jsDocComment.returnType,
      type: normalizeTypeString(returnTypeNode.getText())
    },
    tags: jsDocComment.tags,
    typeParameters: []
  }
}
