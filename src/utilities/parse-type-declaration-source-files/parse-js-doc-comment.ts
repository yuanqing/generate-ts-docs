import * as ts from 'typescript'

import { JsDocData } from '../../types'
import { traverseNode } from './find-node'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind'

export function parseJsDocComment(
  node: ts.Node
): null | {
  description: null | string
  parametersJsDoc: null | JsDocData
  tags: null | JsDocData
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
  const jsDocTagNodes = jsDocCommentNode
    .getChildren()
    .filter(function (node: ts.Node) {
      return node.kind === ts.SyntaxKind.JSDocTag
    })
  const tags =
    jsDocTagNodes.length === 0 ? null : parseJsDocTagNodes(jsDocTagNodes, 0)
  if (tags !== null && Object.keys(tags).indexOf('ignore') !== -1) {
    // has ignore tag
    return null
  }
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
        : parseJsDocTagNodes(jsDocParameterTagNodes, 1),
    tags
  }
}

function parseJsDocTagNodes(
  jsDocTagNodes: Array<ts.Node>,
  keyIndex: number
): JsDocData {
  const result: JsDocData = {}
  for (const jsDocTagNode of jsDocTagNodes) {
    const key = jsDocTagNode.getChildAt(keyIndex).getText()
    const comment = (jsDocTagNode as ts.JSDocTag).comment
    result[key] = typeof comment === 'undefined' ? null : normalizeText(comment)
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
