import * as ts from 'typescript'

import { FunctionData } from '../../types'
import { traverseNode } from './find-node'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind'
import { getNextSiblingNode } from './operations/get-sibling-node'
import { isKind } from './operations/is-kind'
import { parseJsDocComment } from './parse-js-doc-comment'
import { serializeParametersSyntaxListNode } from './serialize-parameters-syntax-list-node'
import { serializeTypeNode } from './serialize-type-node/serialize-type-node'

export function serializeFunctionDeclarationNode(node: ts.Node): FunctionData {
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
  const { description, parametersJsDoc, tags } = parseJsDocComment(node)
  return {
    description,
    name: functionIdentifierNode.getText(),
    parameters:
      parametersSyntaxListNode === null
        ? []
        : serializeParametersSyntaxListNode(
            parametersSyntaxListNode,
            parametersJsDoc
          ),
    returnType:
      returnTypeNode === null ? null : serializeTypeNode(returnTypeNode),
    tags
  }
}
