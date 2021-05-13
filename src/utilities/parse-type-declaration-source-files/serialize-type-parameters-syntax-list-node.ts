import ts from 'typescript'

import { TypeParameterData } from '../../types.js'
import { normalizeTypeString } from './normalize-type-string.js'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind.js'
import { getNextSiblingNode } from './operations/get-sibling-node.js'
import { traverseNode } from './traverse-node.js'

export function serializeTypeParametersSyntaxListNode(
  node: ts.Node
): Array<TypeParameterData> {
  const childNodes = node
    .getChildren()
    .filter(function (node: ts.Node): boolean {
      return node.kind === ts.SyntaxKind.TypeParameter
    })
  return childNodes.map(function (childNode: ts.Node): TypeParameterData {
    const identifierNode = traverseNode(childNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.Identifier)
    ])
    if (identifierNode === null) {
      throw new Error('`identifierNode` is null')
    }
    const typeNode = traverseNode(childNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.ExtendsKeyword),
      getNextSiblingNode()
    ])
    const defaultTypeNode = traverseNode(childNode, [
      findFirstChildNodeOfKind(ts.SyntaxKind.EqualsToken),
      getNextSiblingNode()
    ])
    return {
      defaultType:
        defaultTypeNode === null
          ? null
          : normalizeTypeString(defaultTypeNode.getText()),
      name: identifierNode.getText(),
      type: typeNode === null ? null : normalizeTypeString(typeNode.getText())
    }
  })
}
