import ts from 'typescript'

import { TypeParameterData } from '../../../types.js'
import { normalizeTypeString } from './normalize-type-string.js'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind.js'
import { getNextSiblingNode } from './operations/get-sibling-node.js'
import { traverseNode } from './traverse-node.js'

/*
AST of `node`:
- TypeParameter
  - Identifier <= `identifierNode`
  - ExtendsKeyword
  - ? <= `typeNode`
  - EqualsToken
  - ? <= `defaultTypeNode`
- CommaToken
- TypeParameter
  - ...
- CommaToken
- ...
- TypeParameter
*/

export function serializeTypeParametersSyntaxListNode(
  node: ts.Node
): Array<TypeParameterData> {
  const typeParameterNodes = node
    .getChildren()
    .filter(function (node: ts.Node): boolean {
      return node.kind === ts.SyntaxKind.TypeParameter
    })
  return typeParameterNodes.map(function (
    typeParameterNode: ts.Node
  ): TypeParameterData {
    const identifierNode = traverseNode(typeParameterNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.Identifier)
    ])
    if (identifierNode === null) {
      throw new Error('`identifierNode` is null')
    }
    const typeNode = traverseNode(typeParameterNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.ExtendsKeyword),
      getNextSiblingNode()
    ])
    const defaultTypeNode = traverseNode(typeParameterNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.EqualsToken),
      getNextSiblingNode()
    ])
    const name = identifierNode.getText()
    return {
      defaultType:
        defaultTypeNode === null
          ? null
          : normalizeTypeString(defaultTypeNode.getText()),
      name,
      type: typeNode === null ? null : normalizeTypeString(typeNode.getText())
    }
  })
}
