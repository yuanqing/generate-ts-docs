import * as ts from 'typescript'

import { DocEntry } from '../types'
import { findNode } from './find-node'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind'
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

function serializeFunctionDeclarationNode(node: ts.Node): DocEntry {
  const functionIdentifierNode = findNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.FunctionKeyword),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.Identifier)
  ])
  if (functionIdentifierNode === null) {
    throw new Error('`functionIdentifierNode` is null')
  }
  const jsDocCommentNode = findNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.JSDocComment)
  ])
  const jsDocParameterTagNodes =
    jsDocCommentNode === null
      ? null
      : jsDocCommentNode.getChildren().filter(function (node: ts.Node) {
          return node.kind === ts.SyntaxKind.JSDocParameterTag
        })
  const parametersSyntaxListNode = findNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.OpenParenToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.SyntaxList)
  ])
  const returnTypeNode = findNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
    getNextSiblingNode()
  ])
  const comment =
    jsDocCommentNode === null ? null : (jsDocCommentNode as ts.JSDoc).comment
  return {
    data: {
      parameters:
        parametersSyntaxListNode === null
          ? null
          : serializeSyntaxListNode(
              parametersSyntaxListNode,
              jsDocParameterTagNodes === null
                ? null
                : parseJsDocParameterTagNodes(jsDocParameterTagNodes)
            ),
      returnType: returnTypeNode === null ? null : returnTypeNode.getText()
    },
    description:
      comment === null || typeof comment === 'undefined' ? null : comment,
    name: functionIdentifierNode.getText(),
    type: 'function'
  }
}

function serializeSyntaxListNode(
  node: ts.Node,
  parameterJsDoc: null | { [key: string]: string }
): null | Array<DocEntry> {
  if (node === null) {
    return null
  }
  const childNodes = node.getChildren().filter(function (node: ts.Node) {
    return (
      node.kind === ts.SyntaxKind.Parameter ||
      node.kind === ts.SyntaxKind.PropertySignature
    )
  })
  return childNodes.map(function (childNode: ts.Node) {
    const identifierNode = findNode(childNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
      getPreviousSiblingNode(),
      isKind(ts.SyntaxKind.Identifier)
    ])
    if (identifierNode === null) {
      throw new Error('`identifierNode` is null')
    }
    const name = identifierNode.getText()
    const description = parameterJsDoc === null ? null : parameterJsDoc[name]
    const typeNode = findNode(childNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.ColonToken),
      getNextSiblingNode()
    ])
    if (typeNode === null) {
      throw new Error('`typeNode` is null')
    }
    if (typeNode.kind === ts.SyntaxKind.FunctionType) {
      // function
      return {
        data: {
          ...serializeFunctionTypeNode(typeNode)
        },
        description,
        name,
        type: 'function'
      }
    }
    if (typeNode.kind === ts.SyntaxKind.TypeLiteral) {
      // object
      const parametersSyntaxListNodes = findNode(typeNode, [
        findFirstChildNodeOfKind(ts.SyntaxKind.OpenBraceToken),
        getNextSiblingNode(),
        isKind(ts.SyntaxKind.SyntaxList)
      ])
      if (parametersSyntaxListNodes === null) {
        throw new Error('`parametersSyntaxListNodes` is null')
      }
      return {
        data: {
          keys: serializeSyntaxListNode(parametersSyntaxListNodes, null)
        },
        description,
        name,
        type: 'object'
      }
    }
    return {
      data: null,
      description,
      name,
      type: typeNode.getText()
    }
  })
}

function serializeFunctionTypeNode(node: ts.Node) {
  const returnTypeNode = findNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.EqualsGreaterThanToken),
    getNextSiblingNode()
  ])
  const parametersSyntaxListNodes = findNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.OpenParenToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.SyntaxList)
  ])
  return {
    parameters:
      parametersSyntaxListNodes === null
        ? null
        : serializeSyntaxListNode(parametersSyntaxListNodes, null),
    returnType: returnTypeNode === null ? null : returnTypeNode.getText()
  }
}

function parseJsDocParameterTagNodes(
  jsDocParameterTagNodes: Array<ts.Node>
): { [key: string]: string } {
  const result: { [key: string]: string } = {}
  for (const jsDocParameterTagNode of jsDocParameterTagNodes) {
    const name = jsDocParameterTagNode.getChildAt(1).getText()
    const comment = (jsDocParameterTagNode as ts.JSDocParameterTag).comment
    if (typeof comment !== 'undefined') {
      result[name] = comment
    }
  }
  return result
}
