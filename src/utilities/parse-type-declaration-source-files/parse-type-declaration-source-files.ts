import ts from 'typescript'

import { FunctionData } from '../../types.js'
import { serializeFunctionDeclarationNode } from './serialize-function-declaration-node.js'
import { serializeVariableStatementNode } from './serialize-variable-statement-node.js'

export function parseTypeDeclarationSourceFiles(
  sourceFiles: Array<ts.SourceFile>
): Array<FunctionData> {
  const result: Array<FunctionData> = []
  for (const sourceFile of sourceFiles) {
    sourceFile.forEachChild(function (node: ts.Node) {
      if (node.kind === ts.SyntaxKind.FunctionDeclaration) {
        const functionData = serializeFunctionDeclarationNode(node) // eg. `export function foo () {}`
        if (functionData !== null) {
          result.push(functionData)
        }
        return
      }
      if (node.kind === ts.SyntaxKind.VariableStatement) {
        const functionData = serializeVariableStatementNode(node) // eg. `export const foo = function () {}`
        if (functionData !== null) {
          result.push(functionData)
        }
      }
    })
  }
  return result.sort(sortFunctionsDataComparator)
}

function sortFunctionsDataComparator(a: FunctionData, b: FunctionData): number {
  const nameCompareResult = a.name.localeCompare(b.name)
  const aWeight = parseWeight(a)
  const bWeight = parseWeight(b)
  if (aWeight !== null) {
    if (bWeight !== null) {
      const weightCompareResult = aWeight - bWeight
      if (weightCompareResult === 0) {
        return nameCompareResult
      }
      return weightCompareResult
    }
    return -1 // `a` comes first since `b` has no `weight`
  }
  if (bWeight !== null) {
    return 1 // `b` comes first since `a` has no `weight`
  }
  return nameCompareResult
}

function parseWeight(functionData: FunctionData): null | number {
  if (
    typeof functionData.jsDocTags === 'undefined' ||
    functionData.jsDocTags === null ||
    typeof functionData.jsDocTags.weight === 'undefined' ||
    functionData.jsDocTags.weight === null
  ) {
    return null
  }
  const weight = parseFloat(functionData.jsDocTags.weight)
  if (isNaN(weight) === true) {
    return null
  }
  return weight
}
