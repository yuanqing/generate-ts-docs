import * as ts from 'typescript'

import { DocEntry } from '../../types'
import { traverseNode } from './find-node'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind'
import {
  getNextSiblingNode,
  getPreviousSiblingNode
} from './operations/get-sibling-node'
import { isKind } from './operations/is-kind'
import { parseJsDocComment } from './parse-js-doc-comment'
import { serializeFunctionTypeNode } from './serialize-function-type-node'

export function serializeVariableStatementNode(node: ts.Node): DocEntry {
  const { description, parametersJsDoc } = parseJsDocComment(node)
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
  return {
    data: serializeFunctionTypeNode(typeNode, parametersJsDoc),
    description,
    name,
    type: 'function'
  }
}
