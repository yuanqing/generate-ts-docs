import * as ts from 'typescript'

import { DocEntry } from '../types'
import { findNode } from './find-node'
import { findChildNodeOfKind } from './operations/find-child-node-of-kind'
import {
  getNextSiblingNode,
  getPreviousSiblingNode
} from './operations/get-sibling-node'
import { isKind } from './operations/is-kind'

export function parseTypeDeclarationSourceFiles(
  sourceFiles: Array<ts.SourceFile>
): Array<DocEntry> {
  const result: Array<DocEntry> = []
  for (const sourceFile of sourceFiles) {
    sourceFile.forEachChild(function (node: ts.Node) {
      if (ts.isFunctionDeclaration(node) && node.name) {
        result.push(serializeFunctionDeclarationNode(node))
      }
    })
  }
  return result
}

function serializeFunctionDeclarationNode(node: ts.Node) {
  const functionIdentifierNode = findNode(node, [
    findChildNodeOfKind(ts.SyntaxKind.FunctionKeyword),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.Identifier)
  ])
  if (functionIdentifierNode === null) {
    throw new Error('`functionIdentifierNode` is null')
  }
  const returnTypeNode = findNode(node, [
    findChildNodeOfKind(ts.SyntaxKind.ColonToken),
    getNextSiblingNode()
  ])
  const parametersSyntaxListNodes = findNode(node, [
    findChildNodeOfKind(ts.SyntaxKind.OpenParenToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.SyntaxList)
  ])
  return {
    data: {
      parameters:
        parametersSyntaxListNodes === null
          ? null
          : serializeSyntaxListNode(parametersSyntaxListNodes),
      returnType: returnTypeNode === null ? null : returnTypeNode.getText()
    },
    name: functionIdentifierNode.getText(),
    type: 'function'
  }
}

function serializeSyntaxListNode(node: ts.Node): Array<DocEntry> {
  const parameterNodes = node.getChildren().filter(function (node: ts.Node) {
    return (
      node.kind === ts.SyntaxKind.Parameter ||
      node.kind === ts.SyntaxKind.PropertySignature
    )
  })
  return parameterNodes.map(function (parameterNode: ts.Node) {
    const identifierNode = findNode(parameterNode, [
      findChildNodeOfKind(ts.SyntaxKind.ColonToken),
      getPreviousSiblingNode(),
      isKind(ts.SyntaxKind.Identifier)
    ])
    if (identifierNode === null) {
      throw new Error('`identifierNode` is null')
    }
    const name = identifierNode.getText()
    const typeNode = findNode(parameterNode, [
      findChildNodeOfKind(ts.SyntaxKind.ColonToken),
      getNextSiblingNode()
    ])
    if (typeNode === null) {
      throw new Error('`typeNode` is null')
    }
    if (typeNode.kind === ts.SyntaxKind.FunctionType) {
      // function
      return {
        data: serializeFunctionTypeNode(typeNode),
        name,
        type: 'function'
      }
    }
    if (typeNode.kind === ts.SyntaxKind.TypeLiteral) {
      // object
      const parametersSyntaxListNodes = findNode(typeNode, [
        findChildNodeOfKind(ts.SyntaxKind.OpenBraceToken),
        getNextSiblingNode(),
        isKind(ts.SyntaxKind.SyntaxList)
      ])
      if (parametersSyntaxListNodes === null) {
        throw new Error('`parametersSyntaxListNodes` is null')
      }
      return {
        data: {
          keys: serializeSyntaxListNode(parametersSyntaxListNodes)
        },
        name,
        type: 'object'
      }
    }
    return {
      data: null,
      name,
      type: typeNode.getText()
    }
  })
}

function serializeFunctionTypeNode(node: ts.Node) {
  const returnTypeNode = findNode(node, [
    findChildNodeOfKind(ts.SyntaxKind.EqualsGreaterThanToken),
    getNextSiblingNode()
  ])
  const parametersSyntaxListNodes = findNode(node, [
    findChildNodeOfKind(ts.SyntaxKind.OpenParenToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.SyntaxList)
  ])
  return {
    parameters:
      parametersSyntaxListNodes === null
        ? null
        : serializeSyntaxListNode(parametersSyntaxListNodes),
    returnType: returnTypeNode === null ? null : returnTypeNode.getText()
  }
}
