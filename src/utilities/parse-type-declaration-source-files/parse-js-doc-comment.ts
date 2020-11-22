import * as ts from 'typescript'

import { traverseNode } from './find-node'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind'

export function parseJsDocComment(
  node: ts.Node
): {
  description: null | string
  parametersJsDoc: null | { [key: string]: string }
} {
  const jsDocCommentNode = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.JSDocComment)
  ])
  if (jsDocCommentNode === null) {
    return {
      description: null,
      parametersJsDoc: null
    }
  }
  const comment = (jsDocCommentNode as ts.JSDoc).comment
  const description = typeof comment === 'undefined' ? null : comment
  const jsDocParameterTagNodes = jsDocCommentNode
    .getChildren()
    .filter(function (node: ts.Node) {
      return node.kind === ts.SyntaxKind.JSDocParameterTag
    })
  return {
    description,
    parametersJsDoc:
      jsDocParameterTagNodes.length === 0
        ? null
        : parseJsDocParameterTagNodes(jsDocParameterTagNodes)
  }
}

function parseJsDocParameterTagNodes(
  jsDocParameterTagNodes: Array<ts.Node>
): { [key: string]: string } {
  const result: { [key: string]: string } = {}
  for (const jsDocParameterTagNode of jsDocParameterTagNodes) {
    const name = jsDocParameterTagNode.getChildAt(1).getText()
    const comment = (jsDocParameterTagNode as ts.JSDocParameterTag).comment
    if (typeof comment !== 'undefined') {
      result[name] = comment
    }
  }
  return result
}
