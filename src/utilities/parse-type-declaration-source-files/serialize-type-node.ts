import ts from 'typescript'

import { JsDocTagsData, ObjectData } from '../../types.js'
import { normalizeTypeString } from './normalize-type-string.js'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind.js'
import { getNextSiblingNode } from './operations/get-sibling-node.js'
import { isKind } from './operations/is-kind.js'
import { serializeSyntaxListNode } from './serialize-parameters-syntax-list-node.js'
import { traverseNode } from './traverse-node.js'

export function serializeTypeNode(
  node: ts.Node,
  parametersJsDoc: null | JsDocTagsData
): string | ObjectData {
  if (node.kind === ts.SyntaxKind.TypeLiteral) {
    return serializeTypeLiteralNode(node, parametersJsDoc)
  }
  return normalizeTypeString(node.getText())
}

function serializeTypeLiteralNode(
  node: ts.Node,
  parametersJsDoc: null | JsDocTagsData
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
    keys: serializeSyntaxListNode(parametersSyntaxListNode, parametersJsDoc),
    type: 'object'
  }
}
