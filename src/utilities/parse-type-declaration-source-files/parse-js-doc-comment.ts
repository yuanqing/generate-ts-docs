import * as ts from 'typescript'

import { traverseNode } from './find-node'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind'

export function parseJsDocComment(
  node: ts.Node
): {
  description: null | string
  parametersJsDoc: null | { [key: string]: string }
  tags: null | { [key: string]: string }
} {
  const jsDocCommentNode = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.JSDocComment)
  ])
  if (jsDocCommentNode === null) {
    return {
      description: null,
      parametersJsDoc: null,
      tags: null
    }
  }
  const comment = (jsDocCommentNode as ts.JSDoc).comment
  const description =
    typeof comment === 'undefined' ? null : normalizeText(comment)
  const jsDocParameterTagNodes = jsDocCommentNode
    .getChildren()
    .filter(function (node: ts.Node) {
      return node.kind === ts.SyntaxKind.JSDocParameterTag
    })
  const jsDocTagNodes = jsDocCommentNode
    .getChildren()
    .filter(function (node: ts.Node) {
      return node.kind === ts.SyntaxKind.JSDocTag
    })
  return {
    description,
    parametersJsDoc:
      jsDocParameterTagNodes.length === 0
        ? null
        : parseJsDocTagNodes(jsDocParameterTagNodes, 1),
    tags:
      jsDocTagNodes.length === 0 ? null : parseJsDocTagNodes(jsDocTagNodes, 0)
  }
}

function parseJsDocTagNodes(
  jsDocTagNodes: Array<ts.Node>,
  keyIndex: number
): { [key: string]: string } {
  const result: { [key: string]: string } = {}
  for (const jsDocTagNode of jsDocTagNodes) {
    const key = jsDocTagNode.getChildAt(keyIndex).getText()
    const comment = (jsDocTagNode as ts.JSDocTag).comment
    if (typeof comment !== 'undefined') {
      result[key] = normalizeText(comment)
    }
  }
  return result
}

function normalizeText(text: string) {
  return text
    .replace(/\n+/g, function (match: string) {
      if (match.length === 1) {
        return ' '
      }
      return match
    })
    .trim()
}
