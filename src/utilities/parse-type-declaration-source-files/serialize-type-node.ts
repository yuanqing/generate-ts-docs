import * as ts from 'typescript'

import { JsDocData, ObjectData } from '../../types'
import { traverseNode } from './find-node'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind'
import { getNextSiblingNode } from './operations/get-sibling-node'
import { isKind } from './operations/is-kind'
import { serializeParametersSyntaxListNode } from './serialize-parameters-syntax-list-node'

export function serializeTypeNode(
  node: ts.Node,
  parametersJsDoc: null | JsDocData
): string | ObjectData {
  if (node.kind === ts.SyntaxKind.TypeLiteral) {
    return serializeTypeLiteralNode(node, parametersJsDoc)
  }
  return normalizeText(node.getText())
}

function serializeTypeLiteralNode(
  node: ts.Node,
  parametersJsDoc: null | JsDocData
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
