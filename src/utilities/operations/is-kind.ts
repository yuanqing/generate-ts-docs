import * as ts from 'typescript'

import { Operation } from '../../types'

export function isKind(kind: ts.SyntaxKind): Operation {
  return function (node: ts.Node): null | ts.Node {
    if (node.kind === kind) {
      return node
    }
    return null
  }
}
