import * as ts from 'typescript'

import { FunctionTypeDocEntry, ObjectTypeDocEntry } from '../../../types'
import { traverseNode } from '../find-node'
import { findFirstChildNodeOfKind } from '../operations/find-first-child-node-of-kind'
import { serializeFunctionTypeNode } from './serialize-function-type-node'
import { serializeTypeLiteralNode } from './serialize-type-literal-node'

export function serializeTypeNode(
  typeNode: ts.Node
): Array<string | FunctionTypeDocEntry | ObjectTypeDocEntry> {
  if (typeNode.kind === ts.SyntaxKind.UnionType) {
    const syntaxListNode = traverseNode(typeNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.SyntaxList)
    ])
    if (syntaxListNode === null) {
      throw new Error('`syntaxListNode` is null')
    }
    const typeNodes = syntaxListNode
      .getChildren()
      .filter(function (node: ts.Node) {
        return node.kind !== ts.SyntaxKind.BarToken
      })
    return typeNodes.map(function (typeNode: ts.Node) {
      return serializeTypeNodeHelper(typeNode)
    })
  }
  return [serializeTypeNodeHelper(typeNode)]
}

function serializeTypeNodeHelper(
  typeNode: ts.Node
): string | FunctionTypeDocEntry | ObjectTypeDocEntry {
  if (typeNode.kind === ts.SyntaxKind.FunctionType) {
    // function
    return serializeFunctionTypeNode(typeNode, null)
  }
  if (typeNode.kind === ts.SyntaxKind.TypeLiteral) {
    // object
    return serializeTypeLiteralNode(typeNode)
  }
  return typeNode.getText()
}
