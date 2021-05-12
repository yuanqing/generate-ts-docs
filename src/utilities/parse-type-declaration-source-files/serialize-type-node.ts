import ts from 'typescript'

import { ObjectData, TagsData } from '../../types.js'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind.js'
import { getNextSiblingNode } from './operations/get-sibling-node.js'
import { isKind } from './operations/is-kind.js'
import { serializeParametersSyntaxListNode } from './serialize-parameters-syntax-list-node.js'
import { traverseNode } from './traverse-node.js'

export function serializeTypeNode(
  node: ts.Node,
  parametersJsDoc: null | TagsData
): string | ObjectData {
  if (node.kind === ts.SyntaxKind.TypeLiteral) {
    return serializeTypeLiteralNode(node, parametersJsDoc)
  }
  return normalizeText(node.getText())
}

function serializeTypeLiteralNode(
  node: ts.Node,
  parametersJsDoc: null | TagsData
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
