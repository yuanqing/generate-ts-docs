import * as ts from 'typescript'

export function generateTypeDeclarationSourceFiles(
  filePaths: Array<string>
): Array<ts.SourceFile> {
  const options = {
    declaration: true,
    emitDeclarationOnly: true
  }
  const typeDeclarationFiles: Array<{
    fileContent: string
    filePath: string
  }> = []
  const host = ts.createCompilerHost(options)
  host.writeFile = function (filePath: string, fileContent: string): void {
    // console.log(fileContent)
    typeDeclarationFiles.push({ fileContent, filePath })
  }
  const program = ts.createProgram(filePaths, options, host)
  program.emit()
  for (const filePath of filePaths) {
    host.readFile(filePath)
  }
  const result: Array<ts.SourceFile> = []
  for (const { fileContent, filePath } of typeDeclarationFiles) {
    result.push(
      ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.ES2020, true)
    )
  }
  return result
}
