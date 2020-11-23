import * as ts from 'typescript'

import { ObjectTypeDocEntry } from '../../../types'
import { traverseNode } from '../find-node'
import { findFirstChildNodeOfKind } from '../operations/find-first-child-node-of-kind'
import { getNextSiblingNode } from '../operations/get-sibling-node'
import { isKind } from '../operations/is-kind'
import { serializeParametersSyntaxListNode } from '../serialize-parameters-syntax-list-node'

export function serializeTypeLiteralNode(
  typeNode: ts.Node
): ObjectTypeDocEntry {
  const parametersSyntaxListNode = traverseNode(typeNode, [
    findFirstChildNodeOfKind(ts.SyntaxKind.OpenBraceToken),
    getNextSiblingNode(),
    isKind(ts.SyntaxKind.SyntaxList)
  ])
  if (parametersSyntaxListNode === null) {
    throw new Error('`parametersSyntaxListNodes` is null')
  }
  return {
    keys: serializeParametersSyntaxListNode(parametersSyntaxListNode, null),
    type: 'object'
  }
}
