import * as ts from 'typescript'

import { Operation } from './operation'

export const getPreviousSiblingNode = getSiblingNodeFactory(-1)
export const getNextSiblingNode = getSiblingNodeFactory(1)

function getSiblingNodeFactory(offset: -1 | 1) {
  return function (): Operation {
    return function (node: ts.Node): null | ts.Node {
      const siblingNodes = node.parent.getChildren()
      const index = siblingNodes.findIndex(function (siblingNode: ts.Node) {
        return siblingNode === node
      })
      if (index === -1) {
        throw new Error('Invariant violation')
      }
      const siblingNode = siblingNodes[index + offset]
      if (typeof siblingNode === 'undefined') {
        return null
      }
      return siblingNode
    }
  }
}
