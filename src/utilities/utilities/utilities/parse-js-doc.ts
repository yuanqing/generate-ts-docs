import ts from 'typescript'

import { JsDocTagsData } from '../../../types.js'
import { findFirstChildNodeOfKind } from './operations/find-first-child-node-of-kind.js'
import { traverseNode } from './traverse-node.js'

// Returns `null` if the JSDoc comment contains an `@ignore` or `@internal` tag
export function parseJsDoc(node: ts.Node): null | {
  description: null | string
  parameters: null | JsDocTagsData
  returnType: null | string
  tags: null | JsDocTagsData
} {
  const jsDocCommentNode = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.JSDocComment)
  ])
  if (jsDocCommentNode === null) {
    // No JSDoc comment
    return {
      description: null,
      parameters: null,
      returnType: null,
      tags: null
    }
  }
  const tags = parseTags(jsDocCommentNode)
  if (
    tags !== null &&
    (typeof tags.ignore !== 'undefined' || typeof tags.internal !== 'undefined')
  ) {
    // Has `@ignore` or `@internal` tag, so return `null`
    return null
  }
  const description = (jsDocCommentNode as ts.JSDoc).comment
  const returnType = parseReturnTypeDescription(jsDocCommentNode)
  const parameters = parseParameterDescriptions(jsDocCommentNode)
  return {
    description:
      typeof description === 'undefined'
        ? null
        : normalizeLineBreaks(description),
    parameters,
    returnType:
      typeof returnType === 'undefined' || returnType === null
        ? null
        : returnType,
    tags
  }
}

function parseReturnTypeDescription(node: ts.Node): null | string {
  const jsDocReturnTagNode = traverseNode(node, [
    findFirstChildNodeOfKind(ts.SyntaxKind.JSDocReturnTag)
  ])
  if (jsDocReturnTagNode === null) {
    return null
  }
  const returnTypeDescription = (jsDocReturnTagNode as ts.JSDocReturnTag)
    .comment
  if (typeof returnTypeDescription === 'undefined') {
    return null
  }
  return normalizeLineBreaks(returnTypeDescription)
}

function parseParameterDescriptions(node: ts.Node): null | JsDocTagsData {
  const jsDocParameterTagNodes = node
    .getChildren()
    .filter(function (node: ts.Node): boolean {
      return node.kind === ts.SyntaxKind.JSDocParameterTag
    })
  return jsDocParameterTagNodes.length === 0
    ? null
    : parseJsDocTagNodes(jsDocParameterTagNodes, 1)
}

function parseTags(node: ts.Node): null | JsDocTagsData {
  const jsDocTagNodes = node
    .getChildren()
    .filter(function (node: ts.Node): boolean {
      return node.kind === ts.SyntaxKind.JSDocTag
    })
  return jsDocTagNodes.length === 0
    ? null
    : parseJsDocTagNodes(jsDocTagNodes, 0)
}

function parseJsDocTagNodes(
  jsDocTagNodes: Array<ts.Node>,
  keyIndex: number
): JsDocTagsData {
  const result: JsDocTagsData = {}
  for (const jsDocTagNode of jsDocTagNodes) {
    const key = jsDocTagNode.getChildAt(keyIndex).getText()
    const comment = (jsDocTagNode as ts.JSDocTag).comment
    result[key] =
      typeof comment === 'undefined' ? null : normalizeLineBreaks(comment)
  }
  return result
}

const singleLineBreakRegex = /\n(?![\n-])/g

export function normalizeLineBreaks(string: string) {
  return string.replace(singleLineBreakRegex, ' ')
}
