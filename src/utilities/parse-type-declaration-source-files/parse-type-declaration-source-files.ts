import * as ts from 'typescript'

import { FunctionData } from '../../types'
import { serializeFunctionDeclarationNode } from './serialize-function-declaration-node'
import { serializeVariableStatementNode } from './serialize-variable-statement-node'

export function parseTypeDeclarationSourceFiles(
  sourceFiles: Array<ts.SourceFile>
): Array<FunctionData> {
  const result: Array<FunctionData> = []
  for (const sourceFile of sourceFiles) {
    sourceFile.forEachChild(function (node: ts.Node) {
      if (node.kind === ts.SyntaxKind.FunctionDeclaration) {
        const functionData = serializeFunctionDeclarationNode(node) // export function foo
        if (functionData !== null) {
          result.push(functionData)
        }
        return
      }
      if (node.kind === ts.SyntaxKind.VariableStatement) {
        const functionData = serializeVariableStatementNode(node) // export const foo = function
        if (functionData !== null) {
          result.push(functionData)
        }
      }
    })
  }
  return result.sort(function (a, b) {
    return a.name.localeCompare(b.name)
  })
}
