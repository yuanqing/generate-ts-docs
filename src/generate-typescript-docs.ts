import { FunctionBase } from './types'
import { generateTypeDeclarationSourceFiles } from './utilities/generate-type-declaration-source-files'
import { parseTypeDeclarationSourceFiles } from './utilities/parse-type-declaration-source-files/parse-type-declaration-source-files'

export function generateTypeScriptDocs(
  filePaths: Array<string>
): Array<FunctionBase> {
  const sourceFiles = generateTypeDeclarationSourceFiles(filePaths)
  return parseTypeDeclarationSourceFiles(sourceFiles)
}
