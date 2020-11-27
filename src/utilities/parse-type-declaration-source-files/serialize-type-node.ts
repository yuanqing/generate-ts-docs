import * as ts from 'typescript'

import { ObjectData, ParametersJsDocData } from '../../types'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind'
import { getNextSiblingNode } from './operations/get-sibling-node'
import { isKind } from './operations/is-kind'
import { serializeParametersSyntaxListNode } from './serialize-parameters-syntax-list-node'
import { traverseNode } from './traverse-node'

export function serializeTypeNode(
  node: ts.Node,
  parametersJsDoc: null | ParametersJsDocData
): string | ObjectData {
  if (node.kind === ts.SyntaxKind.TypeLiteral) {
    return serializeTypeLiteralNode(node, parametersJsDoc)
  }
  return normalizeText(node.getText())
}

function serializeTypeLiteralNode(
  node: ts.Node,
  parametersJsDoc: null | ParametersJsDocData
): ObjectData {
  const parametersSyntaxListNode = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.OpenBraceToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.SyntaxList)
  ])
  if (parametersSyntaxListNode === null) {
    throw new Error('`parametersSyntaxListNodes` is null')
  }
  return {
    keys: serializeParametersSyntaxListNode(
      parametersSyntaxListNode,
      parametersJsDoc
    ),
    type: 'object'
  }
}

function normalizeText(text: string) {
  return text.replace(/\n+/g, ' ').replace(/ +/g, ' ').trim()
}
