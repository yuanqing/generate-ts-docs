import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'

export function generateTypeDeclarationSourceFiles(
  filePaths: Array<string>,
  tsconfigFilePath: null | string
): Array<ts.SourceFile> {
  const options = resolveCompilerOptions(tsconfigFilePath)
  const typeDeclarationFiles: Array<{
    fileContent: string
    filePath: string
  }> = []
  const host = ts.createCompilerHost(options)
  host.writeFile = function (filePath: string, fileContent: string): void {
    const filePathWithTsExtension = filePath.replace(/\.d\.ts$/, '.ts')
    if (filePaths.indexOf(filePathWithTsExtension) !== -1) {
      typeDeclarationFiles.push({
        fileContent,
        filePath: filePathWithTsExtension
      })
    }
  }
  const program = ts.createProgram(filePaths, options, host)
  const emitResult = program.emit()
  if (emitResult.diagnostics.length > 0) {
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(emitResult.diagnostics, host)
    )
  }
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

function resolveCompilerOptions(
  tsconfigFilePath: null | string
): ts.CompilerOptions {
  const options = {
    declaration: true,
    declarationMap: false,
    emitDeclarationOnly: true,
    outDir: undefined,
    removeComments: false
  }
  if (tsconfigFilePath === null) {
    const defaultTsConfigFilePath = path.join(process.cwd(), 'tsconfig.json')
    if (fs.existsSync(defaultTsConfigFilePath) === false) {
      return options
    }
    return {
      ...readTsConfigCompilerOptions(defaultTsConfigFilePath),
      ...options
    }
  }
  if (fs.existsSync(tsconfigFilePath) === false) {
    throw new Error(`Configuration file not found at ${tsconfigFilePath}`)
  }
  return {
    ...readTsConfigCompilerOptions(tsconfigFilePath),
    ...options
  }
}

function readTsConfigCompilerOptions(
  tsconfigFilePath: string
): ts.CompilerOptions {
  const tsConfig = ts.parseConfigFileTextToJson(
    tsconfigFilePath,
    fs.readFileSync(tsconfigFilePath, 'utf8')
  )
  if (tsConfig.error) {
    throw tsConfig.error
  }
  const { errors, options } = ts.convertCompilerOptionsFromJson(
    tsConfig.config.compilerOptions,
    path.dirname(tsconfigFilePath)
  )
  if (errors.length > 0) {
    throw errors
  }
  return options
}
