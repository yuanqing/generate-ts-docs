import * as ts from 'typescript'

import { Operation } from '../types'

export function findNode(
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
