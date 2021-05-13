import ts from 'typescript'

import { normalizeTypeString } from './normalize-type-string.js'

export function serializeTypeParametersSyntaxListNode(
  node: ts.Node
): Array<string> {
  return node
    .getChildren()
    .filter(function (node: ts.Node): boolean {
      return node.kind === ts.SyntaxKind.TypeParameter
    })
    .map(function (node: ts.Node): string {
      return normalizeTypeString(node.getText())
    })
}
