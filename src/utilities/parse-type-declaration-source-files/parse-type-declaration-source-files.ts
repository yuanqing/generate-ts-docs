import * as ts from 'typescript'

import { FunctionDocEntry } from '../../types'
import { serializeFunctionDeclarationNode } from './serialize-function-declaration-node'
import { serializeVariableStatementNode } from './serialize-variable-statement-node'

export function parseTypeDeclarationSourceFiles(
  sourceFiles: Array<ts.SourceFile>
): Array<FunctionDocEntry> {
  const result: Array<FunctionDocEntry> = []
  for (const sourceFile of sourceFiles) {
    sourceFile.forEachChild(function (node: ts.Node) {
      if (node.kind === ts.SyntaxKind.FunctionDeclaration) {
        result.push(serializeFunctionDeclarationNode(node)) // export function foo
        return
      }
      if (node.kind === ts.SyntaxKind.VariableStatement) {
        result.push(serializeVariableStatementNode(node)) // export const foo = function
      }
    })
  }
  return result
}
