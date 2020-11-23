import * as ts from 'typescript'

import { FunctionTypeData, ObjectTypeData } from '../../../types'
import { traverseNode } from '../find-node'
import { findFirstChildNodeOfKind } from '../operations/find-first-child-node-of-kind'
import { serializeFunctionTypeNode } from './serialize-function-type-node'
import { serializeTypeLiteralNode } from './serialize-type-literal-node'

export function serializeTypeNode(
  node: ts.Node
): Array<string | FunctionTypeData | ObjectTypeData> {
  if (node.kind === ts.SyntaxKind.UnionType) {
    const syntaxListNode = traverseNode(node, [
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
  return [serializeTypeNodeHelper(node)]
}

function serializeTypeNodeHelper(
  node: ts.Node
): string | FunctionTypeData | ObjectTypeData {
  if (node.kind === ts.SyntaxKind.FunctionType) {
    // function
    return serializeFunctionTypeNode(node, null)
  }
  if (node.kind === ts.SyntaxKind.TypeLiteral) {
    // object
    return serializeTypeLiteralNode(node)
  }
  return node.getText()
}
