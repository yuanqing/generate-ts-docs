import ts from 'typescript'

import { Operation } from './operations/operation.js'

export function traverseNode(
  node: ts.Node,
  operations: Array<Operation>
): null | ts.Node {
  let result: null | ts.Node = node
  for (const operation of operations) {
    result = operation(result)
    if (result === null) {
      return null
    }
  }
  return result
}
